package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Transactional
    @Modifying
    @Query("UPDATE User a " +
            "SET a.enabled = TRUE WHERE a.username = ?1")
    int enableAppUser(String email);

    @Transactional
    @Modifying
    @Query("SELECT u.first_name, u.second_name, u.username, u.phone_number, u.role, (SELECT name FROM School WHERE id=u.school_id) FROM User u WHERE u.locked=True")
    List<User> getAllLocked(Boolean isLocked);
}
