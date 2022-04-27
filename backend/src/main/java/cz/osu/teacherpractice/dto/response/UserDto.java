package cz.osu.teacherpractice.dto.response;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String secondName;
    private String phoneNumber;
    private SchoolDto school;
}
