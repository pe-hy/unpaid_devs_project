package cz.osu.teacherpractice.mapper;

import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.dto.SubjectDto;
import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.dto.response.PracticeDto;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
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

    PracticeDto practiceToPracticeDto(Practice practice);

    List<PracticeDto> practicesToPracticesDto(List<Practice> practice);
}
