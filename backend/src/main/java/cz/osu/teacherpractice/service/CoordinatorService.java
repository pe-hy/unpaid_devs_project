package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.domain.PracticeDomain;
import cz.osu.teacherpractice.dto.request.AssignSchoolDto;
import cz.osu.teacherpractice.dto.request.RegistrationDto;
import cz.osu.teacherpractice.dto.response.*;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.*;
import cz.osu.teacherpractice.repository.*;
import cz.osu.teacherpractice.service.email.EmailValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CoordinatorService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;
    private final SchoolRepository schoolRepository;
    private final ReviewRepository reviewRepository;
    private final EmailValidator emailValidator;

    private final TeacherService teacherService;

    private final UserService userService;

    public List<UserDto> getWaitingList() {
        List<User> users = userRepository.getAllLocked();
        return mapper.usersToUsersDto(users);
    }

    public List<StudentPracticeDto> getPracticesListPast(LocalDate date, Long subjectId, Pageable pageable) {
        List<Practice> practices = practiceRepository.findAllByParamsAsList(date, subjectId, pageable);
        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);
        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setStudentNames(teacherService.getStudentNamesByPractice(p, pageable));
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            p.setStudentEmails(teacherService.getStudentEmailsByPractice(p, pageable));
            String report = userService.getPracticeReport(p.getId());
            p.setReport(report);
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removePassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }
        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }
    public String addSchool(SchoolDto newSchoolDto) {
        String schoolName = newSchoolDto.getName();
        if(schoolRepository.findByName(schoolName).isPresent()) {
            throw new IllegalStateException("Škola již existuje.");
        }else {
            School school = mapper.schoolDtoToSchool(newSchoolDto);
            schoolRepository.save(school);
        }
        return "Škola byla přidána.";
    }

    public String addSubject(SubjectDto subjectDto) {
        String subjectName = subjectDto.getName();
        if(subjectRepository.findByName(subjectName).isPresent()) {
            throw new IllegalStateException("Předmět již existuje.");
        }else {
            Subject subject = mapper.subjectDtoToSubject(subjectDto);
            subjectRepository.save(subject);
        }
        return "Předmět byl přidán.";
    }

    public String removeSchool(String school) {
        if (schoolRepository.findByName(school).isPresent()) {
            System.out.println("Removing" + " " + school);
            Optional<School> schoolEntity = schoolRepository.findByName(school);
            userRepository.setSchoolNull(schoolEntity);
            System.out.println(schoolRepository.findByName(school));
            System.out.println(userRepository.setSchoolNull(schoolEntity));
            int ret = schoolRepository.deleteSchoolByName(school);
            if (ret == 1) return "School deleted";
            else return "Something went wrong;";
        } else return "School wasn't deleted";
    }

    public String removeSubject(String subject) {
        if (subjectRepository.findByName(subject).isPresent()) {
            System.out.println("Removing" + " " + subject);
            Optional<Subject> subjectEntity = subjectRepository.findByName(subject);
            practiceRepository.setSubjectNull(subjectEntity);
            System.out.println(subjectRepository.findByName(subject));
            System.out.println(practiceRepository.setSubjectNull(subjectEntity));
            int ret = subjectRepository.deleteSubjectByName(subject);
            if (ret == 1) return "Subject deleted";
            else return "Something went wrong;";
        } else return "Subject wasn't deleted";
    }

    public List<UserDto> getTeachersWithoutSchool(){
        return mapper.usersToUsersDto(userRepository.getAllTeachersWithoutSchool());
    }

    public String assignSchool(AssignSchoolDto request){
        Optional<School> school = schoolRepository.findByName(request.getSchool());
        if(school.isPresent()){
            String username = request.getUsername();
            Long id = school.get().getId();
            userRepository.assignSchool(username, id);
            return "Škola byla přiřazena.";
        }
        return "Škola nebyla přiřazena.";
    }

    public String editSubject(String originalSubject, String newSubject) {
        if (subjectRepository.findByName(originalSubject).isPresent()) {
            System.out.println("Editing" + " " + originalSubject);
            Optional<Subject> subjectEntity = subjectRepository.findByName(originalSubject);

            int ret = subjectRepository.setSubjectName(originalSubject, newSubject);

            if (ret == 1) return "Subject was edited";
            else return "Something went wrong;";
        } else return "Subject wasn't edited";

    }

    public String editSchool(String originalSchool, String newSchool) {
        if (schoolRepository.findByName(originalSchool).isPresent()) {

            Optional<School> schoolEntity = schoolRepository.findByName(originalSchool);

            int ret = schoolRepository.setSchoolName(originalSchool, newSchool);

            if (ret == 1) return "School was edited";
            else return "Something went wrong;";
        } else return "School wasn't edited";

    }

    public String changePhoneNumber(String username, String phoneNumber) {
        System.out.println(username + " " + phoneNumber);
        if (userRepository.findByEmail(username).isPresent()) {
            Long userId = userRepository.findByEmail(username).get().getId();
            System.out.println("Editing" + " " + username + " " + "phone number.");

            int ret = userRepository.changeUserPhoneNumber(phoneNumber, userId);

            if (ret == 1) return "Phone number was edited";
            else return "Something went wrong;";
        } else return "Phone number wasn't edited";

    }

    public List<Map<Long, List<ReviewDto>>> getStudentReviews() {

        List<Map<Long, List<ReviewDto>>> mappedReviews = new ArrayList<>();
        List<Practice> practices = practiceRepository.findAll();

        for (Practice practice :
                practices) {

            List<Review> revs = reviewRepository.getAllByPracticeId(practice.getId());

            List<ReviewDto> ret = new ArrayList<>();
            for (Review rev :
                    revs) {
                ReviewDto revDto = new ReviewDto();
                revDto.setPracticeId(practice.getId());
                revDto.setName(rev.getStudent().getFirstName() + " " + rev.getStudent().getSecondName());
                revDto.setReviewText(rev.getText());
                ret.add(revDto);
            }

            mappedReviews.add(Map.of(practice.getId(), ret));
        }
        return mappedReviews;
    }

    public List<StudentPracticeDto> getPracticesList(LocalDate date, Long subjectId, Pageable pageable) {
        List<Practice> practices = practiceRepository.findAllByParamsAsList(date, subjectId, pageable);
        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);
        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setStudentNames(teacherService.getStudentNamesByPractice(p, pageable));
            p.setStudentEmails(teacherService.getStudentEmailsByPractice(p, pageable));
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removeNotPassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }

        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }

    public String register(RegistrationDto request){

        if(!emailValidator.checkEmail(request.getEmail(), request.getRole())){
            throw new IllegalStateException("Email není validní");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalStateException("Email již existuje");
        }

        String email, password, firstName, lastName, phoneNumber;
        School school;
        Role role;
        boolean locked, enabled;

        email = request.getEmail();
        password = UUID.randomUUID().toString();
        firstName = request.getFirstName();
        lastName = request.getLastName();
        phoneNumber = request.getPhoneNumber();
        school = schoolRepository.getSchoolById(request.getSchool());
        role = Role.COORDINATOR;
        locked = false;
        enabled = true;

        userService.signUpCoordinator(
                new User(email, password, firstName, lastName, school, phoneNumber, role, locked, enabled)
        );

        return "Účet byl úspěšně vytvořen.";
    }
}
