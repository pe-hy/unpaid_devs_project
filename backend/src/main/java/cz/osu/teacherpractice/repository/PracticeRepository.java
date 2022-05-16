package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.Practice;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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
public interface PracticeRepository extends JpaRepository<Practice, Long> {

    @Query("SELECT p FROM Practice p WHERE (:date is null or p.date = :date) and (:subject_id is null or p.subject.id = :subject_id)")
    List<Practice> findAllByParamsAsList(@Param("date") LocalDate date, @Param("subject_id") Long subjectId, Pageable pageable);

    @Query("SELECT p FROM Practice p WHERE (:date is null or p.date = :date) and (:subject_id is null or p.subject.id = :subject_id) and (:teacher_id is null or p.teacher.id = :teacher_id)")
    List<Practice> findAllByParamsAsListByTeacher(@Param("date") LocalDate date, @Param("subject_id") Long subjectId, @Param("teacher_id") Long teacher_id, Pageable pageable);

    @Query("SELECT p FROM Practice p WHERE (:date is null or p.date = :date) and (:subject_id is null or p.subject.id = :subject_id)")
    Slice<Practice> findAllByParamsAsSlice(@Param("date") LocalDate date, @Param("subject_id") Long subjectId, Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Practice p SET p.subject = null WHERE p.subject = :subject")
    int setSubjectNull(Optional<Subject> subject);

    List<Practice> findAllByTeacherUsername(String teacherUsername);
    List<Practice> findAllBystudents_id(Long student_id, Pageable pageable);

}
