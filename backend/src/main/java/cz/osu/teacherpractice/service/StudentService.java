package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.domain.PracticeDomain;
import cz.osu.teacherpractice.dto.response.ReviewDto;
import cz.osu.teacherpractice.dto.response.StudentPracticeDto;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.exception.UserErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.Review;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.ReviewRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final PracticeRepository practiceRepository;
    private final MapStructMapper mapper;
    private final UserService userService;
    private final ReviewRepository reviewRepository;

    public List<StudentPracticeDto> getPracticesList(String studentUsername, LocalDate date, Long subjectId, Pageable pageable) {
        List<Practice> practices = practiceRepository.findAllByParamsAsList(date, subjectId, pageable);
        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);
        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setIsCurrentStudentReserved(studentUsername);
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removeNotPassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }

        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }

    public List<StudentPracticeDto> getStudentReservedPractices(String studentUsername, Pageable pageable) {
        User student = userRepository.findByEmail(studentUsername).orElseThrow(() -> new ServerErrorException(
                        "Student '" + studentUsername + "' nenalezen."
                )
        );

        Long studentId = student.getId();


        List<Practice> practices = practiceRepository.findAllBystudents_id(studentId, pageable);

        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);
        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setIsCurrentStudentReserved(studentUsername);
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removeNotPassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }

        return mapper.practicesDomainToStudentPracticesDto(practicesDomain);
    }

    public List<StudentPracticeDto> getStudentPassedPractices(String studentUsername, Pageable pageable) {
        User student = userRepository.findByEmail(studentUsername).orElseThrow(() -> new ServerErrorException(
                        "Student '" + studentUsername + "' nenalezen."
                )
        );

        Long studentId = student.getId();

        List<Practice> practices = practiceRepository.findAllBystudents_id(studentId, pageable);

        //sort practices by date
        practices.sort((p1, p2) -> p1.getDate().compareTo(p2.getDate()));

        List<PracticeDomain> practicesDomain = mapper.practicesToPracticesDomain(practices);
        List<PracticeDomain> toDelete = new ArrayList<>();

        practicesDomain.forEach(p -> {
            p.setNumberOfReservedStudents();
            p.setIsCurrentStudentReserved(studentUsername);
            p.setFileNames(userService.getTeacherFiles(p.getTeacher().getUsername()));
            String report = userService.getPracticeReport(p.getId());
            p.setReport(report);
            toDelete.add(p);
        });

        for (PracticeDomain practiceDomain : toDelete) {
            if (practiceDomain.removePassedPractices()) {
                practicesDomain.remove(practiceDomain);
            }
        }
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

    public String submitReview(String name, Long practiceId, String text) {

        Practice practice = practiceRepository.getById(practiceId);
        Optional<User> student = userRepository.findByEmail(name);

        if(student.isPresent()){
            if(reviewRepository.findReviewByStudentIdAndPracticeId(student.get().getId(), practiceId) != null){
                return "Již jste jedno hodnocení této praxi napsal.";
            }
            Review rev = new Review();
            rev.setStudent(student.get());
            rev.setPractice(practice);
            rev.setText(text);
            reviewRepository.save(rev);
            return "Hodnocení bylo úspěšně uloženo.";
        }

        return "Chyba při ukládání hodnocení.";
    }

    public ReviewDto getStudentReview(Long studentId){
        Review rev = reviewRepository.getReviewByStudentId(studentId);
        return mapper.reviewToReviewDto(rev);
    }
}
