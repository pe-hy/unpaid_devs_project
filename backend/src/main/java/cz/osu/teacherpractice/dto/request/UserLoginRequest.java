package cz.osu.teacherpractice.dto.request;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String username;
    private String password;
}
