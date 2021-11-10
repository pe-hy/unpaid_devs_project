package cz.osu.teacherpractice.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @PostMapping("/register")
    public String registerUser() {
        return "OK";
    }
}
