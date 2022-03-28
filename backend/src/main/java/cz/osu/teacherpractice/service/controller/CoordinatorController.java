package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.request.RegistrationDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.CoordinatorService;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public List<UserDto> getLockedUsers() {

        return coordinatorService.getWaitingList();
    }

    @PostMapping(path="/removeUser")
    public String removeUser(@RequestBody String request) {
        String result = request.substring(1, request.length() - 1);
        return userService.removeUser(result);
    }

    @PostMapping(path="/unlockUser")
    public String unlockUser(@RequestBody String request) {
        String result = request.substring(1, request.length() - 1);
        return userService.unlockUser(result);
    }
}
