package cz.osu.teacherpractice.dto.response;

import cz.osu.teacherpractice.dto.SubjectDto;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class LockedUsersDto {
    private Long id;
    private String firstName;
    private String secondName;
    private String email;
    private Integer phoneNumber;
    private String schoolName;
}
