package cz.osu.teacherpractice.dto.request;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.constraint.annotation.DateStartsAfter;
import cz.osu.teacherpractice.constraint.annotation.IntegerRange;
import cz.osu.teacherpractice.constraint.annotation.TimeStartBeforeEnd;
import cz.osu.teacherpractice.dto.SubjectDto;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@TimeStartBeforeEnd(start = "start", end = "end", message = "Čas začátku praxe musí předcházet času konce praxe.")
public class NewPracticeDto {

    @NotNull(message = "Datum praxe musí být zadané.")
    @DateStartsAfter(days = AppConfig.CREATE_PRACTICE_DAYS_LEFT, message = "Praxe musí začínat nejdříve za {days} dní.")
    private LocalDate date;

    @NotNull(message = "Čas začátku praxe musí být zadaný.")
    private LocalTime start;

    @NotNull(message = "Čas konce praxe musí být zadaný.")
    private LocalTime end;

    @Size(max = AppConfig.PRACTICE_NOTE_MAX_LENGTH, message = "Maximální délka poznámky je {max} znaků.")
    private String note;

    @NotNull(message = "Kapacita musí být zadaná.")
    @IntegerRange(min = AppConfig.PRACTICE_MIN_CAPACITY, max = AppConfig.PRACTICE_MAX_CAPACITY, message = "Kapacita musí být v rozsahu {min} a {max}.")
    private Integer capacity;

    @Valid
    @NotNull(message = "Předmět musí být zadaný.")
    private SubjectDto subject;
}
