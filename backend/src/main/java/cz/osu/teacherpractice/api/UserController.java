package cz.osu.teacherpractice.api;

import cz.osu.teacherpractice.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController @RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

    @PostMapping("/register")
    public String registerUser() {
        return "Registration not implemented yet.";
    }

    @GetMapping("/user/subjects")
    public ResponseEntity<List<String>> getSubjects() {
        return new ResponseEntity<>(userService.getSubjects(), HttpStatus.OK);
    }

    @GetMapping("/user/schools")
    public ResponseEntity<List<String>> getSchools() {
        return new ResponseEntity<>(userService.getSchools(), HttpStatus.OK);
    }
}
