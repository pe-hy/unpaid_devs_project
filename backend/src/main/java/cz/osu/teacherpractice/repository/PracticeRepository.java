package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.Practice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PracticeRepository extends JpaRepository<Practice, Long> {
    List<Practice> findAllByOrderByDateAscStartAsc();
    List<Practice> findByDateOrderByStart(LocalDate date);
    List<Practice> findBySubjectIdOrderByDateAscStartAsc(Long id);
    List<Practice> findByDateAndSubjectIdOrderByStart(LocalDate date, Long id);

    List<Practice> findAllByTeacherUsername(String teacherUsername);
}
