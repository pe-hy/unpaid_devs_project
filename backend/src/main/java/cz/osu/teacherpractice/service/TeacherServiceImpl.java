package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.request.AddPracticeRequest;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final UserRepo userRepo;
    private final SubjectRepo subjectRepo;
    private final PracticeRepo practiceRepo;

    @Override
    public void addPractice(String teacherUsername, AddPracticeRequest practiceRequest) {
        User teacher = userRepo.findByUsername(teacherUsername);
        Subject subject = subjectRepo.findById(practiceRequest.getSubjectId())
                .orElseThrow(() -> new IllegalStateException("Subject not found."));

        Practice practice = new Practice();
        practice.setDate(practiceRequest.getDate());
        practice.setStart(practiceRequest.getStart());
        practice.setEnd(practiceRequest.getEnd());
        practice.setSubject(subject);
        practice.setTeacher(teacher);
        practiceRepo.save(practice);

        teacher.getTeacherPractices().add(practice);
        userRepo.save(teacher);
    }
}
