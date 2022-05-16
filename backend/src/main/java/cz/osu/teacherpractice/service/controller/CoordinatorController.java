package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.request.AssignSchoolDto;
import cz.osu.teacherpractice.dto.request.EditSchoolDto;
import cz.osu.teacherpractice.dto.request.EditSubjectDto;
import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.service.CoordinatorService;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
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
    @GetMapping("/practices-list-past")
    public List<StudentPracticeDto> getPracticesListPast(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                         @RequestParam(required=false) Long subjectId, Pageable pageable) {

        return coordinatorService.getPracticesListPast(date, subjectId, pageable);
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
        String result = request.replaceAll("\"", "");
        System.out.println("result after substring: " + " " + result);
        return coordinatorService.removeSchool(result);
    }

    @PostMapping(path = "/removeSubject")
    public String removeSubject(@RequestBody String request) {
        System.out.println("request:" + " " + request);
        String result = request.replaceAll("\"", "");
        System.out.println("result after substring: " + " " + result);
        return coordinatorService.removeSubject(result);
    }

    @PostMapping(path = "/editSubject")
    public String editSubject(@RequestBody EditSubjectDto request) {
        return coordinatorService.editSubject(request.getOriginalSubject(), request.getNewSubject());
    }

    @PostMapping(path = "/editSchool")
    public String editSchool(@RequestBody EditSchoolDto request) {
        return coordinatorService.editSchool(request.getOriginalSchool(), request.getNewSchool());
    }

    @PostMapping(path = "/unlockUser")
    public String unlockUser(@RequestBody String request) {
        String result = request.substring(1, request.length() - 1);
        return userService.unlockUser(result);
    }

    @GetMapping("/getTeachersWithoutSchool")
    public List<UserDto> getTeachersWithoutSchool() {
        return coordinatorService.getTeachersWithoutSchool();
    }

    @PostMapping(path = "/assignSchool")
    public String assignSchool(@RequestBody AssignSchoolDto request) {
        System.out.println(request.getUsername() + " " + request.getSchool());
        return coordinatorService.assignSchool(request);
    }
}
