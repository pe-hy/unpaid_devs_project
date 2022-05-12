package cz.osu.teacherpractice.service.token.forgotPasswordToken;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.service.token.registrationToken.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findAll();

    @Transactional
    @Modifying
    void deleteByExpiryDateLessThan(Date now);

    @Transactional
    @Modifying
    @Query("DELETE from PasswordResetToken c WHERE c.token = ?1")
    void deleteByToken(String token);

    PasswordResetToken findByUser(User user);

    Stream<PasswordResetToken> findAllByExpiryDateLessThan(Date now);

    @Modifying
    @Query("delete from PasswordResetToken t where t.expiryDate <= ?1")
    void deleteAllExpiredSince(Date now);
}
