package cz.osu.teacherpractice.mapper;

import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.domain.PracticeDomain;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MapStructMapper {

    Practice newPracticeDtoToPractice(NewPracticeDto newPracticeDto);

    Subject subjectDtoToSubject(SubjectDto subjectDto);

    SubjectDto subjectToSubjectDto(Subject subject);

    List<SubjectDto> subjectsToSubjectsDto(List<Subject> subjects);

    School schoolDtoToSchool(SchoolDto schoolDto);

    SchoolDto schoolToSchoolDto(School school);

    List<SchoolDto> schoolsToSchoolsDto(List<School> schools);

    PracticeDomain practiceToPracticeDomain(Practice practice);

    List<PracticeDomain> practicesToPracticesDomain(List<Practice> practice);

    List<UserDto> usersToUsersDto(List<User> users);

    User userDtoToUser(UserDto userDto);

    UserDto userToUserDto(User user);

    StudentPracticeDto practiceDomainToStudentPracticeDto(PracticeDomain practiceDomain);

    List<StudentPracticeDto> practicesDomainToStudentPracticesDto(List<PracticeDomain> practiceDomain);
}
