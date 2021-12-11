package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.UserException;
import cz.osu.teacherpractice.resources.request.NewPracticeRequest;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

import static cz.osu.teacherpractice.config.AppConfig.CREATE_PRACTICE_DAYS_LEFT;

@Service @RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final UserRepo userRepo;
    private final SubjectRepo subjectRepo;
    private final PracticeRepo practiceRepo;

    @Override
    public void addPractice(String teacherUsername, NewPracticeRequest practiceRequest) {
        User teacher = userRepo.findByUsername(teacherUsername).orElseThrow(() -> new UserException(
                "Učitel [" + teacherUsername + "] nenalezen."
        ));

        Subject subject = subjectRepo.findById(practiceRequest.getSubjectId()).orElseThrow(() -> new UserException(
                "Předmět s id [" + practiceRequest.getSubjectId() + "] nenalezen."
        ));

        if (LocalDate.now().plusDays(CREATE_PRACTICE_DAYS_LEFT).isAfter(practiceRequest.getDate())) {
            throw new UserException("Praxi je možné přidat nejpozději " + CREATE_PRACTICE_DAYS_LEFT + " dní předem.");
        }

        LocalTime start = practiceRequest.getTime().getStart();
        LocalTime end = practiceRequest.getTime().getEnd();

        if (start.toSecondOfDay() >= end.toSecondOfDay()) {
            throw new UserException("Čas začátku praxe musí předcházet času konce praxe.");
        }

        if (practiceRequest.getCapacity() < 1) {
            throw new UserException("Kapacita nesmí být menší než 1.");
        }

        if (practiceRequest.getCapacity() >= 11) {
            throw new UserException("Kapacita musí být menší nebo rovna 10.");
        }

        if ((Duration.between(start, end).toMinutes()) <= 21) {
            throw new UserException("Praxe musí trvat alespoň 20 minut.");
        }

        Practice practice = new Practice();
        practice.setDate(practiceRequest.getDate());
        practice.setStart(start);
        practice.setEnd(end);
        practice.setNote(practiceRequest.getNote());
        practice.setCapacity(practiceRequest.getCapacity());
        practice.setSubject(subject);
        practice.setTeacher(teacher);
        practiceRepo.save(practice);
    }
}
