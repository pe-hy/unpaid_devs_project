package cz.osu.teacherpractice.dto.response;

import cz.osu.teacherpractice.dto.SchoolDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String secondName;
    private String phoneNumber;
    private SchoolDto school;
}
