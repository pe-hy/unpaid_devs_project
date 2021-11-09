package cz.osu.teacher_practice_reservation_system.data;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class Lesson {
    private Long id;
    private String teacherFirstName;
    private String teacherSecondName;
    private LocalDate date;
    private LocalTime from;
    private LocalTime to;
}
