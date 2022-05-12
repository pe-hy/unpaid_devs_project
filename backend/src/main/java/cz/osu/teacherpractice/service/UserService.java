package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.dto.request.PasswordDto;
import cz.osu.teacherpractice.dto.response.SchoolDto;
import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.mapper.MapStructMapper;
import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.SubjectRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.fileManagement.FileUtil;
import cz.osu.teacherpractice.service.token.forgotPasswordToken.PasswordResetToken;
import cz.osu.teacherpractice.service.token.forgotPasswordToken.PasswordResetTokenRepository;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationToken;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenRepository;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenService;
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
    private final PasswordResetTokenRepository passwordTokenRepository;

    public User createUser(User user) {
        if (userRepository.findByEmail(user.getUsername()).isPresent()) {
            throw new ServerErrorException("Uživatel '" + user.getUsername() + "' již existuje.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean changePassword(String username, PasswordDto passwordDto){
        if(userRepository.findByEmail(username).isPresent()) {
            Long userId = userRepository.findByEmail(username).get().getId();
            String userHashedPassword = userRepository.findByEmail(username).get().getPassword();

            if(passwordEncoder.matches(passwordDto.getOldPassword(), userHashedPassword)){
                String hashedPassword = passwordEncoder.encode(passwordDto.getNewPassword());
                userRepository.changeUserPassword(hashedPassword,userId);
                return true;
            }
            else return false;
        }
        else return false;
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

    public String signUpUser(User user){
        createUser(user);

        String token = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(AppConfig.REGISTRATION_CONFIRMATION_TOKEN_EXPIRY_TIME),
                user
        );
        confirmationTokenService.saveConfirmationToken(confirmationToken);

        return token;
    }

    public User getUserByUsername(String username) {
        Optional<User> user = userRepository.findByEmail(username);
        if(user.isPresent()){
            return user.get();
        }
        else{
            return null;
        }
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

    public List<UserDto> getTeachers() {
        return mapper.usersToUsersDto(userRepository.getAllTeachers());
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

    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        passwordTokenRepository.save(myToken);
    }

    public Optional<User> getUserByPasswordResetToken(final String token) {
        if(passwordTokenRepository.findByToken(token).isPresent()){
            return Optional.ofNullable(passwordTokenRepository.findByToken(token).get().getUser());
        }
        else{
            return Optional.empty();
        }
    }

    public void changeUserPassword(final User user, final String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

}
