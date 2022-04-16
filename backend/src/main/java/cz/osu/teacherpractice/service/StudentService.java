package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.domain.PracticeDomain;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.exception.UserErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service @RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;
    private final UserService userService;

    public List<StudentPracticeDto> getPracticesList(String studentUsername, LocalDate date, Long subjectId, Pageable pageable) {
        List<Practice> practices = practiceRepository.findAllByParamsAsList(date, subjectId, pageable);

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setIsCurrentStudentReserved(studentUsername);
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
        });

        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }

    public Slice<StudentPracticeDto> getPracticesSlice(String studentUsername, LocalDate date, Long subjectId, Pageable pageable) {
        Slice<PracticeDomain> practicesDomain = practiceRepository.findAllByParamsAsSlice(date, subjectId, pageable)
                .map(mapper::practiceToPracticeDomain);

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setIsCurrentStudentReserved(studentUsername);
        });

        return practicesDomain.map(mapper::practiceDomainToStudentPracticeDto);
    }

    public void makeReservation(String studentUsername, Long practiceId) {
        User student = userRepository.findByEmail(studentUsername).orElseThrow(() -> new ServerErrorException(
                "Student '" + studentUsername + "' nenalezen."
        ));

        Practice practice = practiceRepository.findById(practiceId).orElseThrow(() -> new UserErrorException(
                "Požadovaná praxe nebyla nalezena."
        ));

        List<User> registeredStudents = practice.getStudents();

        if (registeredStudents.contains(student)) {
            throw new UserErrorException("Na tuto praxi jste již přihlášen/á.");
        }
        if (registeredStudents.size() >= practice.getCapacity()) {
            throw new UserErrorException("Na tuto praxi se již více studentů přihlásit nemůže. V" +
                    "případě potřeby kontaktujte, prosím, vyučujícího.");
        }
        if (practice.getDate().minusDays(AppConfig.MAKE_RESERVATION_DAYS_LEFT).isBefore(LocalDate.now())) {
            throw new UserErrorException("Na praxi je možné se přihlásit nejpozději " + AppConfig.MAKE_RESERVATION_DAYS_LEFT + " dní předem.");
        }

        registeredStudents.add(student);
        practice.setStudents(registeredStudents);

        practiceRepository.save(practice);
    }

    public void cancelReservation(String studentUsername, Long practiceId) {
        User student = userRepository.findByEmail(studentUsername).orElseThrow(() -> new ServerErrorException(
                "Student '" + studentUsername + "' nenalezen."
        ));

        Practice practice = practiceRepository.findById(practiceId).orElseThrow(() -> new UserErrorException(
                "Požadovaná praxe nebyla nalezena."
        ));

        List<User> registeredStudents = practice.getStudents();

        if (!registeredStudents.contains(student)) {
            throw new UserErrorException("Na tuto praxi nejste přihlášen/á.");
        }
        if (practice.getDate().minusDays(AppConfig.CANCEL_RESERVATION_DAYS_LEFT).isBefore(LocalDate.now())) {
            throw new UserErrorException("Z praxe je možné se odhlásit nejpozději " + AppConfig.CANCEL_RESERVATION_DAYS_LEFT + " dní předem.");
        }

        registeredStudents.remove(student);
        practice.setStudents(registeredStudents);
        
        practiceRepository.save(practice);
    }
}
