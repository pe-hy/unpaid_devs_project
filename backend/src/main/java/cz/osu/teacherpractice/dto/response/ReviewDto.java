package cz.osu.teacherpractice.dto.response;

import lombok.Data;

@Data
public class ReviewDto {
    public Long practiceId;
    public String name;
    public String reviewText;
}
