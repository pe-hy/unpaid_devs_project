package cz.osu.teacherpractice.service.registration;

import cz.osu.teacherpractice.config.AppConfig;
import cz.osu.teacherpractice.dto.request.RegistrationDto;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.email.EmailSender;
import cz.osu.teacherpractice.service.email.EmailValidator;
import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.SchoolRepository;
import cz.osu.teacherpractice.repository.UserRepository;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationToken;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static cz.osu.teacherpractice.config.AppConfig.baseUrlProduction;

@Service
@AllArgsConstructor
public class RegistrationService {

    private final UserService userService;
    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;
    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;

    public String register(RegistrationDto request){

        //check if phone number is in the Czech format
        if(!request.getPhoneNumber().matches("^(\\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$")){
            throw new IllegalStateException("Telefonní číslo musí být v českém formátu.");
        }

        //check if request.getName is lower or equal to 2 or if its bigger or equal to 20
        if (request.getFirstName().length() <= 2 || request.getFirstName().length() >= 20) {
            throw new IllegalStateException("Jméno musí být dlouhé 2 až 20 znaků.");
        }

        if (request.getLastName().length() <= 2 || request.getLastName().length() >= 20) {
            throw new IllegalStateException("Příjmení musí být dlouhé 2 až 20 znaků.");
        }

        if(!emailValidator.checkEmail(request.getEmail(), request.getRole())){
            throw new IllegalStateException("Email není validní");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalStateException("Email již existuje");
        }

        String email, password, firstName, lastName, phoneNumber;
        School school;
        Role role;
        boolean locked;

        switch (request.getRole()) {
            case "student":
                email = request.getEmail();
                password = request.getPassword();
                firstName = request.getFirstName();
                lastName = request.getLastName();
                phoneNumber = null;
                school = null;
                role = Role.STUDENT;
                locked = false;
                break;
            case "teacher":
                email = request.getEmail();
                password = request.getPassword();
                firstName = request.getFirstName();
                lastName = request.getLastName();
                phoneNumber = request.getPhoneNumber();
                school = schoolRepository.getSchoolById(request.getSchool());
                role = Role.TEACHER;
                locked = true;
                break;
            default:
                throw new IllegalStateException("Incorrect role that cannot be converted to enum.");
        }

        String token = userService.signUpUser(
                new User(email, password, firstName, lastName, school, phoneNumber, role, locked)
        );

        String link = baseUrlProduction + "/login?token=" + token;
        emailSender.send(
                request.getEmail(),
                buildEmail(request.getFirstName(), link));

        return token;
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("Token nenalezen."));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("Účet již byl potvrzen.");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Potvrzovací odkaz vypršel.");
        }

        confirmationTokenService.setConfirmedAt(token);
        userService.enableAppUser(
                confirmationToken.getAppUser().getUsername());
        return "E-mail byl úspěšně ověřen.";
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Potvrďte svou registraci</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Dobrý den, " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Děkujeme za registraci. Otevřete prosím následující odkaz k potvrzení e-mailu: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Potvrzovací odkaz</a> </p></blockquote>\n Potvrzovací odkaz vyprší za " + AppConfig.REGISTRATION_CONFIRMATION_TOKEN_EXPIRY_TIME + " minut." +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }
}
