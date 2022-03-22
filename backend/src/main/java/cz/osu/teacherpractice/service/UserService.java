package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.dto.SubjectDto;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.exception.UserErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.token.ConfirmationToken;
import cz.osu.teacherpractice.token.ConfirmationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final MapStructMapper mapper;
    private final ConfirmationTokenService confirmationTokenService;

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new ServerErrorException("Uživatel '" + user.getUsername() + "' již existuje.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> {
            throw new ServerErrorException("Uživatel '" + username + "' nenalezen.");
        });
    }

    public Role getUserRole(String username) {
        return getUserByUsername(username).getRole();
    }

    public List<SubjectDto> getSubjects() {
        return mapper.subjectsToSubjectsDto(subjectRepository.findAll());
    }

    public List<SchoolDto> getSchools() {
        return mapper.schoolsToSchoolsDto(schoolRepository.findAll());
    }

    public String signUpUser(User user){
        createUser(user);

        String token = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(AppConfig.CONFIRMATION_TOKEN_EXPIRY_TIME),
                user
        );
        confirmationTokenService.saveConfirmationToken(confirmationToken);

        //TODO: send email

        return token;
    }

    public int enableAppUser(String email) {
        return userRepository.enableAppUser(email);
    }
}
