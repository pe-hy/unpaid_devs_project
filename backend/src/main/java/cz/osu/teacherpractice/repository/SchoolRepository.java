package cz.osu.teacherpractice.repository;

import cz.osu.teacherpractice.model.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepository extends JpaRepository<School, Long> {

}
