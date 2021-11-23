package cz.osu.teacherpractice.payload.request;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String username;
    private String password;
}
