package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.request.*;
import cz.osu.teacherpractice.dto.response.*;
import cz.osu.teacherpractice.service.CoordinatorService;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.csvReport.CsvReport;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/coordinator")
@RequiredArgsConstructor
public class CoordinatorController {

    private final CoordinatorService coordinatorService;
    private final UserService userService;
    private final CsvReport csvReport;

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

    //add endpoint for changing phone number
    @PostMapping("/changePhoneNumber")
    @ResponseStatus(HttpStatus.OK)
    public String changePhoneNumber(@Valid @RequestBody String phoneNumber, Principal principal) {
        String result = phoneNumber.replaceAll("\"", "");
        //check if phone number is not in Czech format
        if(!result.matches("^(\\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$")) {
            throw new IllegalStateException("Telefonní číslo musí být v českém formátu.");
        }
        return coordinatorService.changePhoneNumber(principal.getName(), result);
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

    @GetMapping("/getReview/{email}/{practiceId}")
    public ReviewDto getReviews(@PathVariable String email, @PathVariable Long practiceId) {
        return userService.getStudentReview(email, practiceId);
    }

    //create getmapping to get all reviews
    @GetMapping("/getAllReviews")
    public Map<Long, String> getAllReviews() {
        return userService.getAllReviews();
    }

    @GetMapping("/practices-list")
    public List<StudentPracticeDto> getPracticesList(@RequestParam(required=false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                     @RequestParam(required=false) Long subjectId, Principal principal, Pageable pageable) {

        return coordinatorService.getPracticesList(date, subjectId, pageable);
    }
    @PostMapping("/registerCoordinator")
    public String register(@RequestBody RegistrationDto request) {

        String ret = coordinatorService.register(request);
        return ret;
    }

    @PostMapping("/deleteCoordinator")
    public String deleteCoordinator(@RequestBody Long id, Principal principal) throws Exception {
        if(Objects.equals(userService.getUserByUsername(principal.getName()).getId(), id)) throw new Exception("Nelze smazat vlastní účet!");
        return coordinatorService.deleteCoordinator(id);
    }

    @PostMapping(path = "/export")
    public ResponseEntity getExport(@RequestBody ExportDatesDto request) {
        LocalDate start = LocalDate.of(request.getStartYear(), request.getStartMonth(), request.getStartDay());
        LocalDate end = LocalDate.of(request.getEndYear(), request.getEndMonth(), request.getEndDay());
        csvReport.createReport("/home/student/project/myproject/backend/export.csv", start, end);

        String name = "/home/student/project/myproject/backend/export.csv";
        Path path = Paths.get(name);
        Resource resource = null;
        try {
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
