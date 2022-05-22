package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.Review;
import cz.osu.teacherpractice.model.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    public Review getReviewByStudentId(Long id);

    public List<Review> getAllByPracticeId(Long id);

    public Review findReviewByStudentIdAndPracticeId(Long studentId, Long practiceId);
}
