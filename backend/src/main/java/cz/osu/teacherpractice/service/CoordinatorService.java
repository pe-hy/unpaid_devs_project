package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.School;
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

    public void addSchool(SchoolDto newSchoolDto) {
        School school = mapper.schoolDtoToSchool(newSchoolDto);
        schoolRepository.save(school);
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
        subjectRepository.deleteSubjectByName(subject);
        if (subjectRepository.findByName(subject).isPresent()) {
            System.out.println("Removing" + " " + subject);
            int ret = subjectRepository.deleteSubjectByName(subject);
            if (ret == 1) return "Subject deleted";
            else return "Something went wrong;";
        } else return "Subject wasn't deleted";
    }

}
