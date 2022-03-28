package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.dto.SubjectDto;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController @RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    @GetMapping("/user/logout")
    public String userLogout() {
        return "logged out";
    }
}