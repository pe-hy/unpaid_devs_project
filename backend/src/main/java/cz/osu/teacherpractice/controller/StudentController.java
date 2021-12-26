package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("")
    public String getStudent(Principal principal) {
        return "Hi student: " + principal.getName();
    }

    @GetMapping("/practices-list")
    public List<StudentPracticeDto> getPracticesList(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @RequestParam(required=false) Long subjectId, Principal principal, Pageable pageable) {

        return studentService.getPracticesList(principal.getName(), date, subjectId, pageable);
    }

    @GetMapping("/practices-slice")
    public Slice<StudentPracticeDto> getPracticesSlice(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                 @RequestParam(required=false) Long subjectId, Principal principal, Pageable pageable) {

        return studentService.getPracticesSlice(principal.getName(), date, subjectId, pageable);
    }

    @PutMapping("/practices/{id}/make-reservation")
    public void makeReservation(Principal principal, @PathVariable("id") Long practiceId) {
        studentService.makeReservation(principal.getName(), practiceId);
    }

    @PutMapping("/practices/{id}/cancel-reservation")
    public void cancelReservation(Principal principal, @PathVariable("id") Long practiceId) {
        studentService.cancelReservation(principal.getName(), practiceId);
    }
}
