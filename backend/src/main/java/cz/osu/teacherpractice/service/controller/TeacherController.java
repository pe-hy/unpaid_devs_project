package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.service.TeacherService;
import cz.osu.teacherpractice.service.fileManagement.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final FileService fileService;

    @GetMapping("/hi")
    public String getTeacher(Principal principal) {
        return "Hi teacher: " + principal.getName();
    }

    @PostMapping("/practice")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPractice(Principal principal, @Valid @RequestBody NewPracticeDto newPracticeDto) {
        teacherService.addPractice(principal.getName(), newPracticeDto);
    }
    @GetMapping("/practices-list")
    public List<StudentPracticeDto> getPracticesList(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                     @RequestParam(required=false) Long subjectId, Principal principal, Pageable pageable) {

        return teacherService.getPracticesList(principal.getName(), date, subjectId, pageable);
    }

    @DeleteMapping(value = "/deleteFile/{name}")
    public ResponseEntity<String> deletePost(Principal principal, @PathVariable String name) {

        boolean isRemoved = fileService.deleteFile(principal.getName(), name);

        if (!isRemoved) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(name, HttpStatus.OK);
    }


}
