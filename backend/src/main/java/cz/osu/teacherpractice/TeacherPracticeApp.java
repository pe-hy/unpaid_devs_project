package cz.osu.teacherpractice;

import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.SchoolRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication @Slf4j
public class TeacherPracticeApp {

    public static void main(String[] args) {
        SpringApplication.run(TeacherPracticeApp.class, args);
    }

    @Bean
    CommandLineRunner run(UserService userService, SubjectRepo subjectRepo, SchoolRepo schoolRepo) {
        return args -> {
            // adding default school
            School school = schoolRepo.save(new School(null, "Gymnázium Ostrava-Zábřeh, Volgogradská 6a", null));

            // adding default users
            userService.saveUser(new User(null, "student", "student", "Adam", "Kovář", Role.STUDENT, null, null, null));
            userService.saveUser(new User(null, "teacher", "teacher", "Karel", "Svoboda", Role.TEACHER, school, null, null));
            userService.saveUser(new User(null, "coordinator", "coordinator", "Milan", "Novák", Role.COORDINATOR, null, null, null));
            userService.saveUser(new User(null, "admin", "admin", "Petra", "Konečná", Role.ADMIN, null, null, null));


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
}
