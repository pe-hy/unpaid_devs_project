package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Long> {
    @Query("SELECT s FROM School s WHERE s.id = :id")
    School getSchoolById(@Param("id") Long id);

    @Query("SELECT s FROM School s WHERE s.name = ?1")
    Optional<School> findByName(String name);

    @Transactional
    @Modifying
    @Query("DELETE FROM School WHERE name = :name")
    int deleteSchoolByName(@Param("name") String name);

}
