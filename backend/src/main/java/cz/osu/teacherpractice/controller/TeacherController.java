package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.exception.ResourceNotFoundException;
import cz.osu.teacherpractice.payload.request.NewPracticeRequest;
import cz.osu.teacherpractice.service.TeacherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherServiceImpl teacherService;

    @GetMapping("")
    public String getTeacher(Principal principal) {
        return "Hi teacher: " + principal.getName();
    }

    @PostMapping("/practice")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPractice(Principal principal, @Valid @RequestBody NewPracticeRequest practiceRequest) {
        try {
            teacherService.addPractice(principal.getName(), practiceRequest);
        } catch (ResourceNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
