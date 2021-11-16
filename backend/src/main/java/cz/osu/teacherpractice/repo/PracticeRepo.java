package cz.osu.teacherpractice.repo;

import cz.osu.teacherpractice.model.Practice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PracticeRepo extends JpaRepository<Practice, Long> {

}
