package cz.osu.teacherpractice.api;

import cz.osu.teacherpractice.payload.request.NewPracticeRequest;
import cz.osu.teacherpractice.service.TeacherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherServiceImpl teacherService;

    @GetMapping("")
    public String getTeacher(Principal principal) {
        return "Hi teacher";
    }

    @PostMapping("/practice")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPractice(Principal principal, @Valid @RequestBody NewPracticeRequest practiceRequest) {
        teacherService.addPractice("teacher", practiceRequest);
    }
}
