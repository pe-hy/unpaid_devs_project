package cz.osu.teacherpractice.api;

import cz.osu.teacherpractice.dto.response.SchoolResponse;
import cz.osu.teacherpractice.dto.response.SubjectResponse;
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
    public List<SubjectResponse> getSubjects() {
        return userService.getSubjects().
                stream().map(this::convertToResponse).
                collect(Collectors.toList());
    }

    @GetMapping("/user/schools")
    public List<SchoolResponse> getSchools() {
        return userService.getSchools().
                stream().map(this::convertToResponse).
                collect(Collectors.toList());
    }

    private SubjectResponse convertToResponse(Subject subject) {
        return modelMapper.map(subject, SubjectResponse.class);
    }

    private SchoolResponse convertToResponse(School school) {
        return modelMapper.map(school, SchoolResponse.class);
    }
}
