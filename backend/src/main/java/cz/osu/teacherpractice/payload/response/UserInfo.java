package cz.osu.teacherpractice.payload.response;

import lombok.Data;

@Data
public class UserInfo {
    private String username;
    private String firstName;
    private String secondName;
    private String schoolName;
}
