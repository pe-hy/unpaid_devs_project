package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.ResourceNotFoundException;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        /*Practice practice = practiceRepo.findById(practiceId).orElseThrow(() -> new ResourceNotFoundException(
                "Practice with id [" +  practiceId + "] not found."
        ));
        User student = userRepo.findByUsername(studentUsername).orElseThrow(() -> new ResourceNotFoundException(
                "Student with username [" + studentUsername + "] not found."
        ));
        practice.setStudent(student);
        practiceRepo.save(practice);*/
    }

    @Override
    public void cancelReservation(String studentUsername, Long practiceId) {
        /*Practice practice = practiceRepo.findById(practiceId).orElseThrow(() -> new ResourceNotFoundException(
                "Practice with id [" +  practiceId + "] not found."
        ));
        User student = userRepo.findByUsername(studentUsername).orElseThrow(() -> new ResourceNotFoundException(
                "Student with username [" + studentUsername + "] not found."
        ));
        if (practice.getStudent().equals(student)) {
            practice.setStudent(null);
        }
        practiceRepo.save(practice);*/
    }
}
