package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.request.RegistrationDto;
import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.email.EmailSender;
import cz.osu.teacherpractice.service.email.EmailValidator;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static cz.osu.teacherpractice.config.AppConfig.baseUrlProduction;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserService userService;
    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;

    public String register(RegistrationDto request){

        if(!emailValidator.checkEmail(request.getEmail(), request.getRole())){
            throw new IllegalStateException("Email není validní");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalStateException("Email již existuje");
        }

        String email, password, firstName, lastName, phoneNumber;
        School school;
        Role role;
        boolean locked, enabled;

        email = request.getEmail();
        password = request.getPassword();
        firstName = request.getFirstName();
        lastName = request.getLastName();
        phoneNumber = request.getPhoneNumber();
        school = schoolRepository.getSchoolById(request.getSchool());
        role = Role.COORDINATOR;
        locked = false;
        enabled = true;

        userService.signUpCoordinator(
                new User(email, password, firstName, lastName, school, phoneNumber, role, locked, enabled)
        );

        return "Účet byl úspěšně vytvořen.";
    }
}
