package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.dto.SubjectDto;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.fileManagement.FileUtil;
import cz.osu.teacherpractice.token.ConfirmationToken;
import cz.osu.teacherpractice.token.ConfirmationTokenRepository;
import cz.osu.teacherpractice.token.ConfirmationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final MapStructMapper mapper;
    private final ConfirmationTokenService confirmationTokenService;

    public User createUser(User user) {
        if (userRepository.findByEmail(user.getUsername()).isPresent()) {
            throw new ServerErrorException("Uživatel '" + user.getUsername() + "' již existuje.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String removeUser(String username){
        if(userRepository.findByEmail(username).isPresent()) {
            System.out.println("before token removal" + " " + username);
            Long userId = userRepository.findByEmail(username).get().getId();
            confirmationTokenRepository.deleteConfirmationTokenById(userId);
            int ret = userRepository.deleteUserByEmail(username);
            if (ret == 1) return "User deleted";
            else return "Something went wrong;";
        }
        else return "User wasn't deleted";
    }

    public String unlockUser(String username){
        if(userRepository.findByEmail(username).isPresent()){
            userRepository.unlockAppUser(username);
            return "user unlocked";
        }
        return "email not found";
    }

    public User getUserByUsername(String username) {
        return userRepository.findByEmail(username).orElseThrow(() -> {
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

        return token;
    }

    public int enableAppUser(String email) {
        return userRepository.enableAppUser(email);
    }

    public List<String> getTeacherFiles(String teacherMail){

        if(userRepository.findByEmail(teacherMail).isPresent()){
            long id = userRepository.findByEmail(teacherMail).get().getId();

            File folder = new File(FileUtil.folderPath + id);
            File[] listOfFiles = folder.listFiles();

            ArrayList<String> list = new ArrayList<>();

            if(listOfFiles == null) return list;
            for (File listOfFile : listOfFiles) {
                if (listOfFile.isFile()) {
                    list.add(listOfFile.getName());
                }
            }
            return list;
        }
        else{
            throw new ServerErrorException("Uživatel s mailem '" + teacherMail + "' nenalezen.");
        }
    }

}
