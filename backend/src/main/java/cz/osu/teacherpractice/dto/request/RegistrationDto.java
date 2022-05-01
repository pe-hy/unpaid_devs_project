package cz.osu.teacherpractice.dto.request;

import lombok.*;

import javax.validation.constraints.NotNull;

@Data
public class RegistrationDto {

    @NotNull(message = "email musí být zadaný.")
    private String email;

    @NotNull(message = "firstName musí být zadaný.")
    private String firstName;

    @NotNull(message = "lastName musí být zadaný.")
    private String lastName;

    private Long school;

    private String phoneNumber;

    @NotNull(message = "password musí být zadaný.")
    private String password;

    @NotNull(message = "role musí být zadaný.")
    private String role;
}
