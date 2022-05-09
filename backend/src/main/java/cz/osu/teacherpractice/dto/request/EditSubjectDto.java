package cz.osu.teacherpractice.dto.request;

import lombok.Data;

@Data
public class EditSubjectDto {
    private String originalSubject;
    private String newSubject;
}
