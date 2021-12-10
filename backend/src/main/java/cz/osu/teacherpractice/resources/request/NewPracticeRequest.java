package cz.osu.teacherpractice.resources.request;

import cz.osu.teacherpractice.annotation.constraint.PracticeDateConstraint;
import cz.osu.teacherpractice.annotation.constraint.PracticeTimeConstraint;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Data
public class NewPracticeRequest {
    @PracticeDateConstraint
    @NotNull(message = "Pole pro datum musí být vyplněné.")
    private LocalDate date;

    @PracticeTimeConstraint
    @NotNull(message = "Čas musí být vyplněný.")
    private NewPracticeTimeRequest time;

    @Size(max = 250, message = "Maximální délka poznámky je {max} znaků.")
    private String note;

    @NotNull(message = "Pole pro kapacitu musí být vyplněné.")
    @Min(value = 1, message = "Kapacita musí být větší nebo rovna {value}.")
    @Max(value = 10, message = "Kapacita musí být menší nebo rovna {value}.")
    private Integer capacity;

    @NotNull(message = "Pole pro předmět musí být vyplněné.")
    private Long subjectId;
}
