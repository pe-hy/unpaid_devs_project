package cz.osu.teacherpractice.dto.request;

import lombok.Data;

@Data
public class EditSchoolDto {
    private String originalSchool;
    private String newSchool;
}
