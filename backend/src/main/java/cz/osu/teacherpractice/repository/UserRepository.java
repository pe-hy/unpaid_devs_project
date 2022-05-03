package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.School;
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

    @Query("SELECT u FROM User u WHERE u.username = ?1")
    Optional<User> findByEmail(String username);

    @Transactional
    @Modifying
    @Query("UPDATE User a SET a.enabled = True WHERE a.username = ?1")
    int enableAppUser(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM User WHERE username = :username")
    int deleteUserByEmail(@Param("username") String username);

    @Transactional
    @Modifying
    @Query("UPDATE User a SET a.locked = False WHERE a.username = :username")
    int unlockAppUser(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.locked = True and u.enabled = True")
    List<User> getAllLocked();

    @Query("SELECT u FROM User u WHERE u.role = 'ROLE_TEACHER'")
    List<User> getAllTeachers();

    @Query("SELECT u FROM User u WHERE u.school is null and u.role = 'ROLE_TEACHER'")
    List<User> getAllTeachersWithoutSchool();

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.school = null WHERE u.school = :school")
    int setSchoolNull(@Param("school") Optional<School> school);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.school.id = :school WHERE u.username = :username")
    int assignSchool(@Param("username") String username, long school);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = :newPasswordHash WHERE u.id = :id")
    int changeUserPassword(@Param("newPasswordHash") String passwordHash, @Param("id") Long id);
}
