package cz.osu.teacherpractice.api;

import cz.osu.teacherpractice.dto.request.AddPracticeRequest;
import cz.osu.teacherpractice.service.TeacherServiceImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
    public void addPractice(Principal principal, @Valid @RequestBody AddPracticeRequest practiceRequest) {
        teacherService.addPractice("teacher", practiceRequest);
    }
}
