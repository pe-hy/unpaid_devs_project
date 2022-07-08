package cz.osu.teacherpractice;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.model.*;
import cz.osu.teacherpractice.repository.*;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.csvReport.CsvReport;
import cz.osu.teacherpractice.service.token.forgotPasswordToken.PasswordResetTokenRepository;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationToken;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenRepository;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

@SpringBootApplication @RequiredArgsConstructor @Lazy @EnableScheduling
public class TeacherPracticeApp {

    private final PracticeRepository practiceRepository;
    private final SchoolRepository schoolRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserService userService;
    private final ReviewRepository reviewRepository;

    private final CsvReport csvReport;

    public static void main(String[] args) {
        SpringApplication.run(TeacherPracticeApp.class, args);
    }

    @Scheduled(cron = AppConfig.CRON_SCHEDULE_CONFIG)
    public void runScheduler() {
        System.out.println("Deleting expired tokens:: " + Calendar.getInstance().getTime());

        passwordResetTokenRepository.deleteByExpiryDateLessThan(new Date());
        confirmationTokenRepository.deleteByExpiresAtLessThan(LocalDateTime.now());
    }

    @Bean
    CommandLineRunner run() {
        return args -> {
            // delete all data from database (turning off in production)
            practiceRepository.deleteAll();
            userRepository.deleteAll();
            subjectRepository.deleteAll();
            schoolRepository.deleteAll();
            confirmationTokenRepository.deleteAll();
            passwordResetTokenRepository.deleteAll();
            reviewRepository.deleteAll();


            // adding default schools
            School school1 = schoolRepository.save(new School(null, "ZŠ Čeladná", null));
            School school2 = schoolRepository.save(new School(null, "ZŠ TGM Frýdlant nad Ostravicí", null));
            School school3 = schoolRepository.save(new School(null, "SŠ Cihelní 410 Frýdek-Místek", null));
            School school4 = schoolRepository.save(new School(null, "SŠ Gymnázium Ostrava-Zábřeh, Volgogradská 6a", null));
            School school5 = schoolRepository.save(new School(null, "ZŠ Dobrá", null));


            // adding default users
            User st1 = new User("student@student.cz", "student", "Adam", "Kovář", school1, null, Role.STUDENT);
            st1.setEnabled(true);
            User st2 = new User("student2@student.cz", "student2", "Jan", "Nowak", school5, null, Role.STUDENT);
            st2.setEnabled(true);
            User st3 = new User("P21072@student.osu.cz", "student", "Pavel", "Novotný", school3, null, Role.STUDENT);
            st3.setEnabled(true);
            User tch = new User("karel.svoboda@email.cz", "teacher", "Karel", "Svoboda", school2, "+420 776 123 456", Role.TEACHER);
            tch.setEnabled(true);
            User coord = new User("coordinator@coordinator.cz", "coordinator", "Milan", "Novák", null, "+420 657 142 441", Role.COORDINATOR);
            coord.setEnabled(true);


            User student = userService.createUser(st1);
            User student2 = userService.createUser(st2);
            User student3 = userService.createUser(st3);
            User teacher = userService.createUser(tch);
            userService.createUser(coord);

            // adding default subjects
            Subject subjectA = subjectRepository.save(new Subject(null, "Španělština", null));
            Subject subjectB = subjectRepository.save(new Subject(null, "Čínština", null));
            Subject subjectC = subjectRepository.save(new Subject(null, "Biologie", null));

            // adding default practices
            Practice practiceA = practiceRepository.save(new Practice(null, LocalDate.parse("2022-11-27"), LocalTime.now().withHour(8).withMinute(0), LocalTime.now().withHour(8).withMinute(45), null, 2, subjectA, teacher, null, null));
            Practice practiceB = practiceRepository.save(new Practice(null, LocalDate.parse("2022-11-26"), LocalTime.now().withHour(11).withMinute(15), LocalTime.now().withHour(12).withMinute(0), null, 2, subjectA, teacher, null, null));
            practiceRepository.save(new Practice(null, LocalDate.now().plusDays(1), LocalTime.now().withHour(9).withMinute(0), LocalTime.now().withHour(9).withMinute(45), null, 2, subjectB, teacher, null, null));
            practiceRepository.save(new Practice(null, LocalDate.now().plusDays(10), LocalTime.now().withHour(10).withMinute(0), LocalTime.now().withHour(10).withMinute(45), null, 2, subjectC, teacher, null, null));
            practiceRepository.save(new Practice(null, LocalDate.parse("2022-10-27"), LocalTime.now().withHour(14).withMinute(10), LocalTime.now().withHour(14).withMinute(55), null, 2, subjectC, teacher, null, null));
            practiceRepository.save(new Practice(null, LocalDate.parse("2022-01-01"), LocalTime.now().withHour(14).withMinute(10), LocalTime.now().withHour(14).withMinute(55), "Testovací proběhlá praxe.", 5, subjectB, teacher, null, null));
            practiceRepository.save(new Practice(null, LocalDate.parse("2021-05-07"), LocalTime.now().withHour(14).withMinute(10), LocalTime.now().withHour(14).withMinute(55), "Testovací proběhlá praxe 2.", 5, subjectB, teacher, null, null));
            //practiceA.setStudents(new ArrayList<>(List.of(student)));
            //practiceRepo.save(practiceA);
            //practiceB.setStudents(new ArrayList<>(List.of(student)));
            //practiceRepo.save(practiceB);
//            String token = UUID.randomUUID().toString();
//            userService.createPasswordResetTokenForUser(student, token);
//
//            String tokenReg = UUID.randomUUID().toString();
//            ConfirmationToken confirmationToken = new ConfirmationToken(
//                    tokenReg,
//                    LocalDateTime.now(),
//                    LocalDateTime.now().plusMinutes(AppConfig.REGISTRATION_CONFIRMATION_TOKEN_EXPIRY_TIME),
//                    student
//            );
//            confirmationTokenService.saveConfirmationToken(confirmationToken);

//            database script
//            INSERT INTO teacher_practice.user_practice (practice_id, student_id)
//            VALUES (12, 1);
//
//            INSERT INTO teacher_practice.user_practice (practice_id, student_id)
//            VALUES (12, 2);
//
//            INSERT INTO teacher_practice.user_practice (practice_id, student_id)
//            VALUES (12, 3);
//
//            INSERT INTO teacher_practice.user_practice (practice_id, student_id)
//            VALUES (13, 1);

        };
    }
}
