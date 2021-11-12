package cz.osu.teacherpractice.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/student")
public class StudentController {

    @GetMapping("")
    public String getStudent(Principal principal) {
        return "Hi " + principal.getName();
    }
}
