package cz.osu.teacherpractice.dto.response;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class SubjectDto {
    private Long id;

    @NotNull(message = "Chybí název předmětu.")
    private String name;
}
