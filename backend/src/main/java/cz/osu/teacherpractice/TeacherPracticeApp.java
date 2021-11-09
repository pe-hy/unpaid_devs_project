package cz.osu.teacherpractice;

import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TeacherPracticeApp {

    public static void main(String[] args) {
        SpringApplication.run(TeacherPracticeApp.class, args);
    }

    @Bean
    CommandLineRunner run(UserService userService) {
        // adding some default users
        return args -> {
            userService.saveUser(new User(null, "student", "student", Role.STUDENT, "Adam", "Boss"));
            userService.saveUser(new User(null, "teacher", "teacher", Role.TEACHER, "Nekdo", "Jiny"));
            userService.saveUser(new User(null, "coordinator", "coordinator", Role.COORDINATOR, "Marek", "Holobradek"));
            userService.saveUser(new User(null, "admin", "admin", Role.ADMIN, "Lojza", "Neveda"));
        };
    }
}
