package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.dto.SubjectDto;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController @RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public String registerUser() {
        System.out.println("register mapping triggered");
        return "Registration not implemented yet.";
    }

    @GetMapping("/user/roles")
    public Map<String, String> getUserRole(Principal principal) {
        return Map.of("role", userService.getUserRole(principal.getName()).getCode());
    }

    @GetMapping("/user/info")
    public Map<String, String> getBasicInfo(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        String firstName = user.getFirstName();
        String secondName = user.getSecondName();
        String role = user.getRole().getCode();
        return Map.of("firstName", firstName, "secondName", secondName, "role", role);
    }

    @GetMapping("/user/subjects")
    public List<SubjectDto> getSubjects() {
        return userService.getSubjects();
    }

    @GetMapping("/user/schools")
    public List<SchoolDto> getSchools() {
        return userService.getSchools();
    }
}
