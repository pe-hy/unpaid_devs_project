package cz.osu.teacherpractice;

import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TeacherPracticeApp {

    public static void main(String[] args) {
        SpringApplication.run(TeacherPracticeApp.class, args);
    }

    @Bean
    CommandLineRunner run(UserService userService) {
        // adding some default users
        return args -> {
            userService.saveUser(new User(null, "student", "student", Role.STUDENT));
            userService.saveUser(new User(null, "teacher", "teacher", Role.TEACHER));
            userService.saveUser(new User(null, "coordinator", "coordinator", Role.COORDINATOR));
            userService.saveUser(new User(null, "admin", "admin", Role.ADMIN));
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
