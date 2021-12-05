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
import org.modelmapper.convention.MatchingStrategies;
import org.modelmapper.spi.MatchingStrategy;
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
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
        PracticeInfo practiceInfo = modelMapper.map(practice, PracticeInfo.class);
        practiceInfo.setRegisteredCount(practiceInfo.getStudents().size());
        return practiceInfo;
    }
}
