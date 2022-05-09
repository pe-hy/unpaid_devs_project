package cz.osu.teacherpractice.dto.request;

import lombok.Data;

@Data
public class ForgotPasswordDto {

    private  String token;

    private String newPassword;
}