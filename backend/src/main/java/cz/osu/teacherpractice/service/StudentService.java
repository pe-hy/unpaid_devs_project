package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.dto.response.PracticeDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.exception.UserException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service @RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;

    public List<PracticeDto> getPractices(String studentUsername, LocalDate date, Long subjectId) {
        List<Practice> practices;

        if (date != null && subjectId != null) {
            practices = practiceRepository.findByDateAndSubjectIdOrderByStart(date, subjectId);
        } else if (date != null) {
            practices = practiceRepository.findByDateOrderByStart(date);
        } else if (subjectId != null) {
            practices = practiceRepository.findBySubjectIdOrderByDateAscStartAsc(subjectId);
        } else {
            practices = practiceRepository.findAllByOrderByDateAscStartAsc();
        }

        List<PracticeDto> practicesDto = mapper.practicesToPracticesDto(practices);

        practicesDto.forEach(p -> p.setRegisteredCount(p.getStudents().size()));
        practicesDto.forEach(p -> p.setIsReserved(p.getStudents().contains(new UserDto(studentUsername))));

        return practicesDto;
    }

    public void makeReservation(String studentUsername, Long practiceId) {
        User student = userRepository.findByUsername(studentUsername).orElseThrow(() -> new UserException(
                "Student '" + studentUsername + "' nenalezen."
        ));
        Practice practice = practiceRepository.findById(practiceId).orElseThrow(() -> new UserException(
                "Požadovaná praxe nebyla nalezena."
        ));

        List<User> registeredStudents = practice.getStudents();

        if (registeredStudents.contains(student)) {
            throw new UserException("Na tuto praxi jste již přihlášen/á.");
        }
        if (registeredStudents.size() >= practice.getCapacity()) {
            throw new UserException("Na tuto praxi se již více studentů přihlásit nemůže. V" +
                    "případě potřeby kontaktujte, prosím, vyučujícího.");
        }
        if (practice.getDate().minusDays(AppConfig.MAKE_RESERVATION_DAYS_LEFT).isBefore(LocalDate.now())) {
            throw new UserException("Na praxi je možné se přihlásit nejpozději " + AppConfig.MAKE_RESERVATION_DAYS_LEFT + " dní předem.");
        }

        registeredStudents.add(student);
        practice.setStudents(registeredStudents);

        practiceRepository.save(practice);
    }

    public void cancelReservation(String studentUsername, Long practiceId) {
        User student = userRepository.findByUsername(studentUsername).orElseThrow(() -> new UserException(
                "Student '" + studentUsername + "' nenalezen."
        ));
        Practice practice = practiceRepository.findById(practiceId).orElseThrow(() -> new UserException(
                "Požadovaná praxe nebyla nalezena."
        ));

        List<User> registeredStudents = practice.getStudents();

        if (!registeredStudents.contains(student)) {
            throw new UserException("Na tuto praxi nejste přihlášen/á.");
        }
        if (practice.getDate().minusDays(AppConfig.CANCEL_RESERVATION_DAYS_LEFT).isBefore(LocalDate.now())) {
            throw new UserException("Z praxe je možné se odhlásit nejpozději " + AppConfig.CANCEL_RESERVATION_DAYS_LEFT + " dní předem.");
        }

        registeredStudents.remove(student);
        practice.setStudents(registeredStudents);
        
        practiceRepository.save(practice);
    }
}
