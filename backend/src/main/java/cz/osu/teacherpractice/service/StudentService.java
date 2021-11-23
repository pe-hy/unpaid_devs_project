package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.model.Practice;

import java.time.LocalDate;
import java.util.List;

public interface StudentService {
    List<Practice> getPractices(LocalDate date, Long subjectId);
    void makeReservation(String studentUsername, Long practiceId);
    void cancelReservation(String studentUsername, Long practiceId);
}
