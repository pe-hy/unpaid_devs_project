package cz.osu.teacherpractice.resources.request;

import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class NewPracticeRequest {
    @NotNull(message = "Pole pro datum musí být vyplněné.")
    private LocalDate date;
    @NotNull(message = "Pole pro začátek praxe musí být vyplněné.")
    private LocalTime start;
    @NotNull(message = "Pole pro konec praxe musí být vyplněné.")
    private LocalTime end;

    private String note;

    @NotNull(message = "Pole pro kapacitu musí být vyplněné.")
    @Min(value = 1, message = "Kapacita musí být větší nebo rovna 1.")
    @Max(value = 10, message = "Kapacita musí být menší nebo rovna 10.")
    private Integer capacity;

    @NotNull(message = "Pole pro předmět musí být vyplněné.")
    private Long subjectId;
}
