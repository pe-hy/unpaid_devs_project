package cz.osu.teacher_practice_reservation_system.controllers;

import cz.osu.teacher_practice_reservation_system.data.Lesson;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
public class MockDataController {

    private static final List<Lesson> data = List.of(
            new Lesson(1L, "Petr", "Novák", LocalDate.of(2021, 4, 4), LocalTime.of(10, 0), LocalTime.of(10, 45)),
            new Lesson(2L, "Radek", "Zbořil", LocalDate.of(2021, 5, 8), LocalTime.of(8, 10), LocalTime.of(8, 55)),
            new Lesson(3L, "Jan", "Nesvoboda", LocalDate.of(2021, 12, 20), LocalTime.of(8, 0), LocalTime.of(12, 0)),
            new Lesson(4L, "Karel", "Silný", LocalDate.of(2020, 6, 11), LocalTime.of(9, 10), LocalTime.of(9, 55)),
            new Lesson(5L, "Stanislav", "Rychlý", LocalDate.of(2020, 1, 14), LocalTime.of(12, 0), LocalTime.of(12, 45))
    );

    @GetMapping("/data")
    public ResponseEntity<List<Lesson>> getData() {
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
