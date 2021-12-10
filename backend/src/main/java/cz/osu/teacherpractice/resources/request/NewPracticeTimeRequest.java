package cz.osu.teacherpractice.resources.request;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalTime;

@Data
public class NewPracticeTimeRequest {
    @NotNull(message = "Pole pro začátek praxe musí být vyplněné.")
    private LocalTime start;
    @NotNull(message = "Pole pro konec praxe musí být vyplněné.")
    private LocalTime end;
}
