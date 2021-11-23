package cz.osu.teacherpractice.payload.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class PracticeInfo {
    private Long id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private SubjectInfo subjectInfo;
    private UserInfo teacher;
    private UserInfo student;
}
