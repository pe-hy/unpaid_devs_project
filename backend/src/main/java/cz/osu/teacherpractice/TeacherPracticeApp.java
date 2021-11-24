package cz.osu.teacherpractice;

import cz.osu.teacherpractice.model.*;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.SchoolRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication @RequiredArgsConstructor
public class TeacherPracticeApp {

    private final PracticeRepo practiceRepo;
    private final SchoolRepo schoolRepo;
    private final SubjectRepo subjectRepo;
    private final UserRepo userRepo;

    public static void main(String[] args) {
        SpringApplication.run(TeacherPracticeApp.class, args);
    }

    @Bean
    CommandLineRunner run() {
        return args -> {
            // delete all data from database
            practiceRepo.deleteAll();
            userRepo.deleteAll();
            subjectRepo.deleteAll();
            schoolRepo.deleteAll();

            // adding default schools
            School school = schoolRepo.save(new School(null, "Gymnázium Ostrava-Zábřeh, Volgogradská 6a", null));

            // adding default users
            User student = userRepo.save(new User(null, "student", "student", "Adam", "Kovář", null, Role.STUDENT, null, null, null));
            User teacher = userRepo.save(new User(null, "teacher", "teacher", "Karel", "Svoboda", null, Role.TEACHER, school, null, null));
            userRepo.save(new User(null, "coordinator", "coordinator", "Milan", "Novák", null, Role.COORDINATOR, null, null, null));
            userRepo.save(new User(null, "admin", "admin", "Petra", "Konečná", null, Role.ADMIN, null, null, null));

            // adding default subjects
            Subject subjectA = subjectRepo.save(new Subject(null, "Španělština", null));
            Subject subjectB = subjectRepo.save(new Subject(null, "Čínština", null));
            Subject subjectC = subjectRepo.save(new Subject(null, "Biologie", null));

            // adding default practices
            Practice practiceA = practiceRepo.save(new Practice(null, LocalDate.parse("2022-11-27"), LocalTime.now().plusHours(1), LocalTime.now(), null, 2, subjectA, teacher, null));
            Practice practiceB = practiceRepo.save(new Practice(null, LocalDate.parse("2022-11-26"), LocalTime.now().plusHours(2), LocalTime.now(), null, 2, subjectA, teacher, null));
            practiceRepo.save(new Practice(null, LocalDate.now().plusDays(1), LocalTime.now().plusHours(3), LocalTime.now(), null, 2, subjectB, teacher, null));
            practiceRepo.save(new Practice(null, LocalDate.now().plusDays(10), LocalTime.now().plusHours(4), LocalTime.now(), null, 2, subjectC, teacher, null));
            practiceRepo.save(new Practice(null, LocalDate.parse("2022-10-27"), LocalTime.now().plusHours(5), LocalTime.now(), null, 2, subjectC, teacher, null));

            practiceA.setStudents(new ArrayList<>(List.of(student)));
            practiceRepo.save(practiceA);
            practiceB.setStudents(new ArrayList<>(List.of(student)));
            practiceRepo.save(practiceB);
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
