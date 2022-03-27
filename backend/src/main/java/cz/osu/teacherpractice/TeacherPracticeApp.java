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
            School school1 = schoolRepository.save(new School(null, "ZŠ Čeladná", null));
            School school2 = schoolRepository.save(new School(null, "ZŠ TGM Frýdlant nad Ostravicí", null));
            School school3 = schoolRepository.save(new School(null, "SŠ Cihelní 410 Frýdek-Místek", null));
            School school4 = schoolRepository.save(new School(null, "SŠ Gymnázium Ostrava-Zábřeh, Volgogradská 6a", null));
            School school5 = schoolRepository.save(new School(null, "ZŠ Dobrá", null));


            // adding default users
            User st1 = new User("student@student.cz", "student", "Adam", "Kovář", null, null, Role.STUDENT);
            st1.setEnabled(true);
            User st2 = new User("student2@student.cz", "student2", "Jan", "Nowak", null, null, Role.STUDENT);
            st2.setEnabled(true);
            User tch = new User("karel.svoboda@email.cz", "teacher", "Karel", "Svoboda", school2, null, Role.TEACHER);
            tch.setEnabled(true);
            User coord = new User("coordinator@coordinator.cz", "coordinator", "Milan", "Novák", null, null, Role.COORDINATOR);
            coord.setEnabled(true);
            User adm = new User("admin@admin.cz", "admin", "Petra", "Konečná", null, null, Role.ADMIN);
            adm.setEnabled(true);


            User student = userService.createUser(st1);
            User student2 = userService.createUser(st2);
            User teacher = userService.createUser(tch);
            userService.createUser(coord);
            userService.createUser(adm);

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
