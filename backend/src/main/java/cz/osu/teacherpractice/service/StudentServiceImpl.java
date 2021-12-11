package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.UserException;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static cz.osu.teacherpractice.config.AppConfig.CANCEL_RESERVATION_DAYS_LEFT;
import static cz.osu.teacherpractice.config.AppConfig.MAKE_RESERVATION_DAYS_LEFT;

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
        Practice practice = practiceRepo.findById(practiceId).orElseThrow(() -> new UserException(
                "Praxe s id [" +  practiceId + "] nenalezena."
        ));
        User student = userRepo.findByUsername(studentUsername).orElseThrow(() -> new UserException(
                "Student [" + studentUsername + "] nenalezen."
        ));

        List<User> students = practice.getStudents();

        if (students == null) {
            practice.setStudents(new ArrayList<>(List.of(student)));
        } else {
            if (students.contains(student)) {
                throw new UserException("Na tuto praxi jste již přihlášen/á.");
            }
            if (students.size() >= practice.getCapacity()) {
                throw new UserException("Na tuto praxi se již více studentů přihlásit nemůže. V" +
                        "případě potřeby kontaktujte, prosím, vyučujícího.");
            }
            if (LocalDate.now().plusDays(MAKE_RESERVATION_DAYS_LEFT).isAfter(practice.getDate())) {
                throw new UserException("Na praxi je možné se přihlásit nejpozději " + MAKE_RESERVATION_DAYS_LEFT + " dní předem.");
            }

            students.add(student);
            practice.setStudents(students);
        }

        practiceRepo.save(practice);
    }

    @Override
    public void cancelReservation(String studentUsername, Long practiceId) {
        Practice practice = practiceRepo.findById(practiceId).orElseThrow(() -> new UserException(
                "Praxe s id [" +  practiceId + "] nenalezena."
        ));
        User student = userRepo.findByUsername(studentUsername).orElseThrow(() -> new UserException(
                "Student [" + studentUsername + "] nenalezen."
        ));

        List<User> students = practice.getStudents();

        if (students == null || !students.contains(student)) {
            throw new UserException("Na tuto praxi nejste přihlášen/á.");
        }
        if (LocalDate.now().plusDays(CANCEL_RESERVATION_DAYS_LEFT).isAfter(practice.getDate())) {
            throw new UserException("Z praxe je možné se odhlásit nejpozději " + CANCEL_RESERVATION_DAYS_LEFT + " dní předem.");
        }

        students.remove(student);
        practice.setStudents(students);
        
        practiceRepo.save(practice);
    }
}
