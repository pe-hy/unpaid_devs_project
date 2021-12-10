package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.UserException;
import cz.osu.teacherpractice.payload.request.NewPracticeRequest;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
