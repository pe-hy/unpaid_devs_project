package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.dto.request.ForgotPasswordDto;
import cz.osu.teacherpractice.dto.request.PasswordDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.email.EmailService;
import cz.osu.teacherpractice.service.fileManagement.FileService;
import cz.osu.teacherpractice.service.security.UserSecurityService;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationToken;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

import static cz.osu.teacherpractice.config.AppConfig.baseUrlProduction;

@RestController @RequiredArgsConstructor
public class UserController {

    private final MapStructMapper mapper;
    private final UserService userService;
    private final FileService fileService;

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

    @PostMapping("/user/changePassword")
    public ResponseEntity<String> changePassword(Principal principal, @Valid @RequestBody PasswordDto passwordDto){
        if(userService.changePassword(principal.getName(), passwordDto)){
            return new ResponseEntity<>("Heslo bylo změněno", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Heslo se nepodařilo změnit", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/subjects")
    public List<SubjectDto> getSubjects() {
        return userService.getSubjects();
    }

    @GetMapping("/user/teachers")
    public List<UserDto> getTeachers() {
        return userService.getTeachers();
    }
    // create getmapping for students
    @GetMapping("/user/students")
    public List<UserDto> getStudents() {
        return userService.getStudents();
    }

    //create getmapping for coordinators
    @GetMapping("/user/coordinators")
    public List<UserDto> getCoordinators() {
        return userService.getCoordinators();
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

    @GetMapping("/user/report/download/{id}")
    public ResponseEntity downloadReportFromLocal(@PathVariable String id) {
        String name = fileService.figureOutReportNameFor(Long.valueOf(id));
        Path path = Paths.get(name);
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
}