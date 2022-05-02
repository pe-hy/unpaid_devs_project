package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.request.AssignSchoolDto;
import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CoordinatorService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;
    private final SchoolRepository schoolRepository;

    public List<UserDto> getWaitingList() {
        List<User> users = userRepository.getAllLocked();
        return mapper.usersToUsersDto(users);
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
}
