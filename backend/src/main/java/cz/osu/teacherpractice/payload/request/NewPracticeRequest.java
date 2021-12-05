package cz.osu.teacherpractice.payload.request;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class NewPracticeRequest {
    @NotNull private LocalDate date;
    @NotNull private LocalTime start;
    @NotNull private LocalTime end;

    private String note;

    @NotNull @Min(value = 1, message = "Capacity must be at least 1.")
    private Integer capacity;

    @NotNull private Long subjectId;
}
