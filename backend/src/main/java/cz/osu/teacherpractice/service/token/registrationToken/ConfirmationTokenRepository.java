package cz.osu.teacherpractice.service.token.registrationToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface ConfirmationTokenRepository
        extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByToken(String token);

    List<ConfirmationToken> findAll();

    @Transactional
    @Modifying
    void deleteByExpiresAtLessThan(LocalDateTime now);

    @Transactional
    @Modifying
    @Query("UPDATE ConfirmationToken c " +
            "SET c.confirmedAt = ?2 " +
            "WHERE c.token = ?1")
    int updateConfirmedAt(String token,
                          LocalDateTime confirmedAt);

    @Transactional
    @Modifying
    @Query("DELETE FROM ConfirmationToken t WHERE t.appUser.id = ?1")
    int deleteConfirmationTokenById(Long userId);
}
