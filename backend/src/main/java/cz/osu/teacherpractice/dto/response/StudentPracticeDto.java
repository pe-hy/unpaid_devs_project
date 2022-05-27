package cz.osu.teacherpractice.dto.response;

import cz.osu.teacherpractice.model.Review;
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
    private String report;
    private List<String> fileNames;
    private List<String> studentNames;
    private List<String> studentEmails;
    private List<ReviewDto> reviews;


    private Integer numberOfReservedStudents;
    private Boolean isCurrentStudentReserved;
}
