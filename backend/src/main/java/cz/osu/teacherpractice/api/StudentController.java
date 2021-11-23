package cz.osu.teacherpractice.api;

import cz.osu.teacherpractice.exception.ResourceNotFoundException;
import cz.osu.teacherpractice.payload.response.PracticeInfo;
import cz.osu.teacherpractice.payload.response.SubjectInfo;
import cz.osu.teacherpractice.payload.response.UserInfo;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.service.StudentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentServiceImpl studentService;
    private final ModelMapper modelMapper;

    @GetMapping("")
    public String getStudent(Principal principal) {
        return "Hi student: " + principal.getName();
    }

    @GetMapping("/practices")
    public List<PracticeInfo> getPractices(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                           @RequestParam(required=false) Long subjectId) {
        List<Practice> practices = studentService.getPractices(date, subjectId);
        return practices.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @PutMapping("/practice/{id}/make-reservation")
    public void makeReservation(@PathVariable("id") Long practiceId) {
        try {
            studentService.makeReservation("student", practiceId);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @PutMapping("/practice/{id}/cancel-reservation")
    public void cancelReservation(@PathVariable("id") Long practiceId) {
        try {
            studentService.cancelReservation("student", practiceId);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    private PracticeInfo convertToResponse(Practice practice) {
        SubjectInfo subject = modelMapper.map(practice.getSubject(), SubjectInfo.class);
        UserInfo student = practice.getStudent() == null ? null : modelMapper.map(practice.getStudent(), UserInfo.class);
        UserInfo teacher = modelMapper.map(practice.getTeacher(), UserInfo.class);

        PracticeInfo practiceInfo = new PracticeInfo();
        practiceInfo.setSubjectInfo(subject);
        practiceInfo.setStudent(student);
        practiceInfo.setTeacher(teacher);
        practiceInfo.setId(practice.getId());
        practiceInfo.setDate(practice.getDate());
        practiceInfo.setStart(practice.getStart());
        practiceInfo.setEnd(practice.getEnd());

        return practiceInfo;
    }
}
