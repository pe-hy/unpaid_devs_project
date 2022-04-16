package cz.osu.teacherpractice.dto.response;

import cz.osu.teacherpractice.dto.SubjectDto;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class StudentPracticeDto {
    private Long id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private String note;
    private Integer capacity;
    private SubjectDto subject;
    private UserDto teacher;
    private List<String> fileNames;

    private Integer numberOfReservedStudents;
    private Boolean isCurrentStudentReserved;
}
