package cz.osu.teacherpractice.api;

import cz.osu.teacherpractice.payload.response.PracticeResponse;
import cz.osu.teacherpractice.payload.response.SubjectResponse;
import cz.osu.teacherpractice.payload.response.UserResponse;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.service.StudentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentServiceImpl studentService;
    private final ModelMapper modelMapper;

    @GetMapping("")
    public String getStudent(Principal principal) {
        return "Hi student";
    }

    @GetMapping("/practices")
    public List<PracticeResponse> getPractices(Principal principal) {
        List<Practice> practices = studentService.getPractices();
        return practices.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private PracticeResponse convertToResponse(Practice practice) {
        SubjectResponse subject = modelMapper.map(practice.getSubject(), SubjectResponse.class);
        UserResponse student = practice.getStudent() == null ? null : modelMapper.map(practice.getStudent(), UserResponse.class);
        UserResponse teacher = modelMapper.map(practice.getTeacher(), UserResponse.class);

        PracticeResponse practiceResponse = new PracticeResponse();
        practiceResponse.setSubjectResponse(subject);
        practiceResponse.setStudent(student);
        practiceResponse.setTeacher(teacher);
        practiceResponse.setId(practice.getId());
        practiceResponse.setDate(practice.getDate());
        practiceResponse.setStart(practice.getStart());
        practiceResponse.setEnd(practice.getEnd());

        return practiceResponse;
    }
}
