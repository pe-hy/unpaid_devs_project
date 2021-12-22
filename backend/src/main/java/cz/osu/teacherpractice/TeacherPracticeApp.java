package cz.osu.teacherpractice;

import cz.osu.teacherpractice.model.*;
import cz.osu.teacherpractice.repository.PracticeRepository;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;

import java.time.LocalDate;
import java.time.LocalTime;

@SpringBootApplication @RequiredArgsConstructor @Lazy
public class TeacherPracticeApp {

    private final PracticeRepository practiceRepository;
    private final SchoolRepository schoolRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(TeacherPracticeApp.class, args);
    }

    @Bean
    CommandLineRunner run() {
        return args -> {
            // delete all data from database
            practiceRepository.deleteAll();
            userRepository.deleteAll();
            subjectRepository.deleteAll();
            schoolRepository.deleteAll();

            // adding default schools
            School school = schoolRepository.save(new School(null, "Gymnázium Ostrava-Zábřeh, Volgogradská 6a", null));

            // adding default users
            User student = userService.createUser(new User(null, "student@student.cz", "student", "Adam", "Kovář", null, Role.STUDENT, null, null, null));
            User student2 = userService.createUser(new User(null, "student2@student.cz", "student2", "Jan", "Nowak", null, Role.STUDENT, null, null, null));
            User teacher = userService.createUser(new User(null, "karel.svoboda@email.cz", "teacher", "Karel", "Svoboda", null, Role.TEACHER, school, null, null));
            userService.createUser(new User(null, "coordinator@coordinator.cz", "coordinator", "Milan", "Novák", null, Role.COORDINATOR, null, null, null));
            userService.createUser(new User(null, "admin@admin.cz", "admin", "Petra", "Konečná", null, Role.ADMIN, null, null, null));

            // adding default subjects
            Subject subjectA = subjectRepository.save(new Subject(null, "Španělština", null));
            Subject subjectB = subjectRepository.save(new Subject(null, "Čínština", null));
            Subject subjectC = subjectRepository.save(new Subject(null, "Biologie", null));

            // adding default practices
            Practice practiceA = practiceRepository.save(new Practice(null, LocalDate.parse("2022-11-27"), LocalTime.now().withHour(8).withMinute(0), LocalTime.now().withHour(8).withMinute(45), null, 2, subjectA, teacher, null));
            Practice practiceB = practiceRepository.save(new Practice(null, LocalDate.parse("2022-11-26"), LocalTime.now().withHour(11).withMinute(15), LocalTime.now().withHour(12).withMinute(0), null, 2, subjectA, teacher, null));
            practiceRepository.save(new Practice(null, LocalDate.now().plusDays(1), LocalTime.now().withHour(9).withMinute(0), LocalTime.now().withHour(9).withMinute(45), null, 2, subjectB, teacher, null));
            practiceRepository.save(new Practice(null, LocalDate.now().plusDays(10), LocalTime.now().withHour(10).withMinute(0), LocalTime.now().withHour(10).withMinute(45), null, 2, subjectC, teacher, null));
            practiceRepository.save(new Practice(null, LocalDate.parse("2022-10-27"), LocalTime.now().withHour(14).withMinute(10), LocalTime.now().withHour(14).withMinute(55), null, 2, subjectC, teacher, null));

            //practiceA.setStudents(new ArrayList<>(List.of(student)));
            //practiceRepo.save(practiceA);
            //practiceB.setStudents(new ArrayList<>(List.of(student)));
            //practiceRepo.save(practiceB);
        };
    }
}
