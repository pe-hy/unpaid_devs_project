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

import java.time.LocalDate;

@Service @RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private static final int ADD_PRACTICE_DAYS_LEFT = 7;

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

        if (LocalDate.now().plusDays(ADD_PRACTICE_DAYS_LEFT).isAfter(practiceRequest.getDate())) {
            throw new UserException("Praxi je možné přidat nejpozději " + ADD_PRACTICE_DAYS_LEFT + " dní předem.");
        }

        if (practiceRequest.getStart().toSecondOfDay() >= practiceRequest.getEnd().toSecondOfDay()) {
            throw new UserException("Čas začátku praxe musí předcházet času konce praxe.");
        }

        Practice practice = new Practice();
        practice.setDate(practiceRequest.getDate());
        practice.setStart(practiceRequest.getStart());
        practice.setEnd(practiceRequest.getEnd());
        practice.setNote(practiceRequest.getNote());
        practice.setCapacity(practiceRequest.getCapacity());
        practice.setSubject(subject);
        practice.setTeacher(teacher);
        practiceRepo.save(practice);
    }
}
