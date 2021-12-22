package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.UserException;
import cz.osu.teacherpractice.dto.request.NewPracticeDto;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;

    public void addPractice(String teacherUsername, NewPracticeDto newPracticeDto) {
        User teacher = userRepository.findByUsername(teacherUsername).orElseThrow(() -> new UserException(
                "Učitel '" + teacherUsername + "' nenalezen."
        ));

        subjectRepository.findById(newPracticeDto.getSubject().getId()).orElseThrow(() -> new UserException(
                "Předmět '" + newPracticeDto.getSubject().getName() + "' nenalezen."
        ));

        Practice practice = mapper.newPracticeDtoToPractice(newPracticeDto);
        practice.setTeacher(teacher);
        practiceRepository.save(practice);
    }

}
