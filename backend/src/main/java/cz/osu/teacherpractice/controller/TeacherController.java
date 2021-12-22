package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("")
    public String getTeacher(Principal principal) {
        return "Hi teacher: " + principal.getName();
    }

    @PostMapping("/practice")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPractice(Principal principal, @Valid @RequestBody NewPracticeDto newPracticeDto) {
        teacherService.addPractice(principal.getName(), newPracticeDto);
    }
}
