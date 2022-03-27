package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SchoolRepository extends JpaRepository<School, Long> {
    @Query("SELECT s FROM School s WHERE s.id = :id")
    School getSchoolById(@Param("id") Long id);
}
