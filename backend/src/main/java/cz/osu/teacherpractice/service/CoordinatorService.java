package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class CoordinatorService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;

    public List<User> getWaitingList() {
        return userRepository.getAllLocked(true);
    }

}
