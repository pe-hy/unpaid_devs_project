package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.dto.response.PracticeDto;
import cz.osu.teacherpractice.service.StudentService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/practices")
    public List<PracticeDto> getPractices(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                          @RequestParam(required=false) Long subjectId, Principal principal) {

        return studentService.getPractices(principal.getName(), date, subjectId);
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
