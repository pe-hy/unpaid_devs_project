package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.repo.PracticeRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final PracticeRepo practiceRepo;

    @Override
    public List<Practice> getPractices() {
        return practiceRepo.findAll();
    }
}
