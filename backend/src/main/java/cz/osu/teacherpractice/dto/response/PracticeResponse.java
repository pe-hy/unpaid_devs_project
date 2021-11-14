package cz.osu.teacherpractice.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PracticeResponse {
    private Long id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private SubjectResponse subjectResponse;
    private UserResponse teacher;
    private UserResponse student;
}
