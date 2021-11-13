package cz.osu.teacherpractice.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AddPracticeRequest {
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private Long subjectId;
}
