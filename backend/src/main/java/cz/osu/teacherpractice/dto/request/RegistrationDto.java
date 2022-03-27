package cz.osu.teacherpractice.dto.request;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class RegistrationDto {

    @NotNull(message = "email musí být zadaný.")
    private final String email;

    @NotNull(message = "firstName musí být zadaný.")
    private final String firstName;

    @NotNull(message = "lastName musí být zadaný.")
    private final String lastName;

    @NotNull(message = "schoolId musí být zadaný.")
    private final Long schoolId;

    private final String phoneNumber;

    @NotNull(message = "password musí být zadaný.")
    private final String password;

    @NotNull(message = "role musí být zadaný.")
    private final String role;
}
