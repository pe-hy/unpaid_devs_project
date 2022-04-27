package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.fileManagement.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController @RequiredArgsConstructor
public class UserController {

    private final MapStructMapper mapper;
    private final UserService userService;
    private final FileService fileService;
    private final UserRepository userRepository;

    @GetMapping("/user/roles")
    public Map<String, String> getUserRole(Principal principal) {
        return Map.of("role", userService.getUserRole(principal.getName()).getCode());
    }

    @GetMapping("/user/info")
    public Map<String, String> getBasicInfo(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        String firstName = user.getFirstName();
        String secondName = user.getSecondName();
        String role = user.getRole().getCode();
        return Map.of("firstName", firstName, "secondName", secondName, "role", role);
    }

    @GetMapping("/user/data")
    public UserDto getUserData(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        return mapper.userToUserDto(user);
    }

    @GetMapping("/user/subjects")
    public List<SubjectDto> getSubjects() {
        return userService.getSubjects();
    }

    @GetMapping("/user/teachers")
    public List<UserDto> getTeachers() {
        return userService.getTeachers();
    }

    @GetMapping("/user/schools")
    public List<SchoolDto> getSchools() {
        return userService.getSchools();
    }

    @GetMapping("/user/teacherFiles/{teacherMail}")
    public List<String> getTeacherFiles(@PathVariable("teacherMail") String teacherMail) {
        return userService.getTeacherFiles(teacherMail);
    }

    @GetMapping("/user/download/{teacherEmail}/{fileName}")
    public ResponseEntity downloadFileFromLocal(@PathVariable String teacherEmail, @PathVariable String fileName) {
        Path path = Paths.get(fileService.figureOutFileNameFor(teacherEmail, fileName));
        Resource resource = null;
        try {
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/user/file/delete/{teacherEmail}/{fileName}")
    public ResponseEntity<String> deleteFileFromLocal(@PathVariable String teacherEmail, @PathVariable String fileName) throws IOException {
        Path path = Paths.get(fileService.figureOutFileNameFor(teacherEmail, fileName));
        Files.delete(path);
        return new ResponseEntity<>("Soubor smazán.", HttpStatus.OK);
    }
}