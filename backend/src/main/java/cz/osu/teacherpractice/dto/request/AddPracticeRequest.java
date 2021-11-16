package cz.osu.teacherpractice.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AddPracticeRequest {
    @NotNull private LocalDate date;
    @NotNull private LocalTime start;
    @NotNull private LocalTime end;
    @NotNull private Long subjectId;
}
