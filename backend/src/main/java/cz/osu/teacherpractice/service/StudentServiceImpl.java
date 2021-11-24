package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.ReservationException;
import cz.osu.teacherpractice.exception.ResourceNotFoundException;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service @RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final UserRepo userRepo;
    private final PracticeRepo practiceRepo;

    @Override
    public List<Practice> getPractices(LocalDate date, Long subjectId) {
        List<Practice> practices;

        if (date != null && subjectId != null) {
            practices = practiceRepo.findByDateAndSubjectIdOrderByStart(date, subjectId);
        } else if (date != null) {
            practices = practiceRepo.findByDateOrderByStart(date);
        } else if (subjectId != null) {
            practices = practiceRepo.findBySubjectIdOrderByDateAscStartAsc(subjectId);
        } else {
            practices = practiceRepo.findAllByOrderByDateAscStartAsc();
        }

        return practices;
    }

    @Override
    public void makeReservation(String studentUsername, Long practiceId) {
        Practice practice = practiceRepo.findById(practiceId).orElseThrow(() -> new ResourceNotFoundException(
                "Practice with id [" +  practiceId + "] not found."
        ));
        User student = userRepo.findByUsername(studentUsername).orElseThrow(() -> new ResourceNotFoundException(
                "Student with username [" + studentUsername + "] not found."
        ));

        List<User> students = practice.getStudents();

        if (students == null) {
            practice.setStudents(new ArrayList<>(List.of(student)));
        } else {
            if (students.contains(student)) {
                throw new ReservationException("Student [" + studentUsername + "] has already made a reservation to this practice.");
            }
            if (students.size() >= practice.getCapacity()) {
                throw new ReservationException("Maximum capacity reached.");
            }
            if (LocalDate.now().plusDays(7).isAfter(practice.getDate())) {
                throw new ReservationException("It is too late to make a reservation to this practice.");
            }

            students.add(student);
            practice.setStudents(students);
        }

        practiceRepo.save(practice);
    }

    @Override
    public void cancelReservation(String studentUsername, Long practiceId) {
        Practice practice = practiceRepo.findById(practiceId).orElseThrow(() -> new ResourceNotFoundException(
                "Practice with id [" +  practiceId + "] not found."
        ));
        User student = userRepo.findByUsername(studentUsername).orElseThrow(() -> new ResourceNotFoundException(
                "Student with username [" + studentUsername + "] not found."
        ));

        List<User> students = practice.getStudents();

        if (students == null || !students.contains(student)) {
            throw new ReservationException("Student [" + studentUsername + "] has not made a reservation to this practice.");
        } else {
            students.remove(student);
            practice.setStudents(students);
        }

        practiceRepo.save(practice);
    }
}
