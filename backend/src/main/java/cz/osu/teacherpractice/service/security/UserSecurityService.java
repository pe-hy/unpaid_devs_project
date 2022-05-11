package cz.osu.teacherpractice.service.security;

import cz.osu.teacherpractice.service.token.forgotPasswordToken.PasswordResetToken;
import cz.osu.teacherpractice.service.token.forgotPasswordToken.PasswordResetTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class UserSecurityService implements ISecurityUserService {

    private PasswordResetTokenRepository passwordTokenRepository;

    @Override
    public boolean validatePasswordResetToken(String token) {
        final Optional<PasswordResetToken> passToken = passwordTokenRepository.findByToken(token);
        return passToken.isPresent() && !isTokenExpired(passToken);
    }

    private boolean isTokenFound(Optional<PasswordResetToken> passToken) {
        return passToken.isPresent();
    }

    private boolean isTokenExpired(Optional<PasswordResetToken> passToken) {
        final Calendar cal = Calendar.getInstance();
        return passToken.get().getExpiryDate().before(cal.getTime());
    }
}
