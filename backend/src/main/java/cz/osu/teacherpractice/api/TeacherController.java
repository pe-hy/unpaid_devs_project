package cz.osu.teacherpractice.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

    @GetMapping("")
    public String getTeacher(Principal principal) {
        return "Hi teacher";
    }
}
