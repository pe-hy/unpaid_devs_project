package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.payload.response.SchoolInfo;
import cz.osu.teacherpractice.payload.response.SubjectInfo;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController @RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;
    private final ModelMapper modelMapper;

    @PostMapping("/register")
    public String registerUser() {
        return "Registration not implemented yet.";
    }

    @GetMapping("/user/subjects")
    public List<SubjectInfo> getSubjects() {
        return userService.getSubjects().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/schools")
    public List<SchoolInfo> getSchools() {
        return userService.getSchools().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private SubjectInfo convertToResponse(Subject subject) {
        return modelMapper.map(subject, SubjectInfo.class);
    }

    private SchoolInfo convertToResponse(School school) {
        return modelMapper.map(school, SchoolInfo.class);
    }
}
