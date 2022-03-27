package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Transactional
    @Modifying
    @Query("UPDATE User a SET a.enabled = TRUE WHERE a.username = ?1")
    int enableAppUser(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM User WHERE username = :email")
    int deleteUserByEmail(@Param("email") String email);

    @Transactional
    @Modifying
    @Query("UPDATE User a SET a.locked = FALSE WHERE a.username = :email")
    int unlockAppUser(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.locked = True")
    List<User> getAllLocked();

    String deleteByEmail(String email);

//    @Transactional
//    @Query("SELECT u.firstName, u.secondName, u.username, u.phoneNumber, u.role FROM User u WHERE u.locked=True")
//    List<User> getAllLocked();
}
