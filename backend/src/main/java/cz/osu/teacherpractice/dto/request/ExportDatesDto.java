package cz.osu.teacherpractice.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExportDatesDto {
    private int startYear;
    private int startMonth;
    private int startDay;
    private int endYear;
    private int endMonth;
    private int endDay;
}
