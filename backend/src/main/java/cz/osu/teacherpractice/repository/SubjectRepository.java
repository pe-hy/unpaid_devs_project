package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    @Query("SELECT s FROM Subject s WHERE s.name = ?1")
    Optional<Subject> findByName(String name);

    @Transactional
    @Modifying
    @Query("DELETE FROM Subject WHERE name = :name")
    int deleteSubjectByName(@Param("name") String name);


}
