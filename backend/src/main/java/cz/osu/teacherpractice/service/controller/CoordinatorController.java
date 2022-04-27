package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.service.CoordinatorService;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    @PostMapping(path = "/removeUser")
    public String removeUser(@RequestBody String request) {
        String result = request.substring(1, request.length() - 1);
        return userService.removeUser(result);
    }

    @PostMapping("/addSchool")
    @ResponseStatus(HttpStatus.CREATED)
    public String addSchool(@Valid @RequestBody SchoolDto newSchoolDto) {
        System.out.println(newSchoolDto);
        return coordinatorService.addSchool(newSchoolDto);
    }

    @PostMapping("/addSubject")
    @ResponseStatus(HttpStatus.CREATED)
    public String addSubject(@Valid @RequestBody SubjectDto subjectDto) {
        System.out.println(subjectDto);
        return coordinatorService.addSubject(subjectDto);
    }

    @PostMapping(path = "/removeSchool")
    public String removeSchool(@RequestBody String request) {
        System.out.println("request:" + " " + request);
        String result = request.substring(1, request.length() - 1);
        System.out.println("result after substring: " + " " + result);
        return coordinatorService.removeSchool(result);
    }

    @PostMapping(path = "/removeSubject")
    public String removeSubject(@RequestBody String request) {
        System.out.println("request:" + " " + request);
        String result = request.substring(1, request.length() - 1);
        System.out.println("result after substring: " + " " + result);
        return coordinatorService.removeSubject(result);
    }

    @PostMapping(path = "/unlockUser")
    public String unlockUser(@RequestBody String request) {
        String result = request.substring(1, request.length() - 1);
        return userService.unlockUser(result);
    }
}
