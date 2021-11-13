package cz.osu.teacherpractice;

import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.PracticeRepo;
import cz.osu.teacherpractice.repo.SchoolRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication @RequiredArgsConstructor @Slf4j
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
            userRepo.save(new User(null, "student", "student", "Adam", "Kovář", Role.STUDENT, null, null, null));
            userRepo.save(new User(null, "teacher", "teacher", "Karel", "Svoboda", Role.TEACHER, school, null, null));
            userRepo.save(new User(null, "coordinator", "coordinator", "Milan", "Novák", Role.COORDINATOR, null, null, null));
            userRepo.save(new User(null, "admin", "admin", "Petra", "Konečná", Role.ADMIN, null, null, null));

            // adding default subjects
            subjectRepo.save(new Subject(null, "Španělština", null));
            subjectRepo.save(new Subject(null, "Čínština", null));
            subjectRepo.save(new Subject(null, "Biologie", null));
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
