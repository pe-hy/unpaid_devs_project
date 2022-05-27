package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.dto.response.ReviewDto;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.service.TeacherService;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.fileManagement.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final FileService fileService;
    private final UserService userService;

    @GetMapping("/hi")
    public String getTeacher(Principal principal) {
        return "Hi teacher: " + principal.getName();
    }

    @PostMapping("/practice")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPractice(Principal principal, @Valid @RequestBody NewPracticeDto newPracticeDto) {
        teacherService.addPractice(principal.getName(), newPracticeDto);
    }
    @GetMapping("/practices-list")
    public List<StudentPracticeDto> getPracticesList(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                     @RequestParam(required=false) Long subjectId, Principal principal, Pageable pageable) {

        return teacherService.getPracticesList(principal.getName(), date, subjectId, pageable);
    }



    @GetMapping("/practices-list-past")
    public List<StudentPracticeDto> getPracticesListPast(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                     @RequestParam(required=false) Long subjectId, Principal principal, Pageable pageable) {

        return teacherService.getPracticesListPast(principal.getName(), date, subjectId, pageable);
    }


    @PostMapping("/file/delete/{teacherEmail}/{fileName}")
    public ResponseEntity<String> deleteFileFromLocal(@PathVariable String teacherEmail, @PathVariable String fileName) throws IOException {
        Path path = Paths.get(fileService.figureOutFileNameFor(teacherEmail, fileName));
        Files.delete(path);
        return new ResponseEntity<>("Soubor smazán.", HttpStatus.OK);
    }

    @GetMapping("/getReview/{email}/{practiceId}")
    public ReviewDto getReviews(@PathVariable String email, @PathVariable Long practiceId) {
        return userService.getStudentReview(email, practiceId);
    }

    @GetMapping("/getAllReviews")
    public Map<Long, String> getAllReviews() {
        return userService.getAllReviews();
    }
}
