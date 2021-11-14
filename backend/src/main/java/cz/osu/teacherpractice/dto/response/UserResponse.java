package cz.osu.teacherpractice.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private String username;
    private String firstName;
    private String secondName;
    private String schoolName;
}
