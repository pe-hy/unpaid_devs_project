package cz.osu.teacherpractice.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/admin")
    public String getAdmin() {
        return "Hi admin";
    }

    @GetMapping("/student")
    public String getUser() {
        return "Hi student";
    }

    @GetMapping("/teacher")
    public String getTeacher() {
        return "Hi teacher";
    }

    @GetMapping("/coordinator")
    public String getCoordinator() {
        return "Hi coordinator";
    }

    @PostMapping("/register")
    public String registerUser() {
        return "OK";
    }
}
