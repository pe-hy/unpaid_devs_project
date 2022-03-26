package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.service.CoordinatorService;
import cz.osu.teacherpractice.service.StudentService;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/coordinator")
@RequiredArgsConstructor
public class CoordinatorController {

    private final CoordinatorService coordinatorService;
    private final UserService userService;

    @GetMapping("")
    public String getCoordinator(Principal principal) {
        return "Hi coordinator: " + principal.getName();
    }
    @GetMapping("/waitingList")
    public List<User> getWaitingList() {
        return coordinatorService.getWaitingList();
    }
}
