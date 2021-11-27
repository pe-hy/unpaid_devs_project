package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.exception.ReservationException;
import cz.osu.teacherpractice.exception.ResourceNotFoundException;
import cz.osu.teacherpractice.model.User;
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
                                           @RequestParam(required=false) Long subjectId,
                                           Principal principal) {
        List<Practice> practices = studentService.getPractices(date, subjectId);
        List<PracticeInfo> practicesInfo = practices.stream().map(this::convertToResponse).collect(Collectors.toList());
        practicesInfo.forEach(p -> p.setIsReserved(p.getStudents() != null && p.getStudents().contains(new UserInfo("student"))));
        return practicesInfo;
    }

    @PutMapping("/practice/{id}/make-reservation")
    public void makeReservation(@PathVariable("id") Long practiceId) {
        try {
            studentService.makeReservation("student", practiceId);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (ReservationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/practice/{id}/cancel-reservation")
    public void cancelReservation(@PathVariable("id") Long practiceId) {
        try {
            studentService.cancelReservation("student", practiceId);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (ReservationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    private PracticeInfo convertToResponse(Practice practice) {
        SubjectInfo subject = modelMapper.map(practice.getSubject(), SubjectInfo.class);

        List<UserInfo> students = practice.getStudents() == null ? null : practice.getStudents().stream()
                .map(this::convertToResponse).collect(Collectors.toList());

        UserInfo teacher = modelMapper.map(practice.getTeacher(), UserInfo.class);

        PracticeInfo practiceInfo = new PracticeInfo();
        practiceInfo.setSubjectInfo(subject);
        practiceInfo.setStudents(students);
        practiceInfo.setTeacher(teacher);
        practiceInfo.setId(practice.getId());
        practiceInfo.setDate(practice.getDate());
        practiceInfo.setStart(practice.getStart());
        practiceInfo.setEnd(practice.getEnd());
        practiceInfo.setNote(practice.getNote());
        practiceInfo.setCapacity(practice.getCapacity());
        practiceInfo.setRegisteredCount(students == null ? 0 : students.size());

        return practiceInfo;
    }

    private UserInfo convertToResponse(User user) {
        return modelMapper.map(user, UserInfo.class);
    }
}
