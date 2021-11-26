package cz.osu.teacherpractice.payload.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class PracticeInfo {
    private Long id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private String note;
    private Integer capacity;
    private Integer currentlyRegistered;
    private SubjectInfo subjectInfo;
    private UserInfo teacher;
    private List<UserInfo> students;
}
