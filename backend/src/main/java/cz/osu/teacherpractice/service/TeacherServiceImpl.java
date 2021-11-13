package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.request.AddPracticeRequest;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor @Slf4j
public class TeacherServiceImpl implements TeacherService {

    private final UserRepo userRepo;
    private final PracticeRepo practiceRepo;

    @Override
    public void addPractice(String teacherUsername, AddPracticeRequest practice) {

    }
}
