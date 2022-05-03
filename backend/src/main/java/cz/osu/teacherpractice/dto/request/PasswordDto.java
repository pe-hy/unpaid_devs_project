package cz.osu.teacherpractice.dto.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class PasswordDto {

    @NotNull(message = "chybí staré heslo.")
    private String oldPassword;

    @NotNull(message = "chybí nové heslo.")
    private String newPassword;
}
