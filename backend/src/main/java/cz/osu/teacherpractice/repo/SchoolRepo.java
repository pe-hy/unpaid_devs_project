package cz.osu.teacherpractice.repo;

import cz.osu.teacherpractice.model.School;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepo extends JpaRepository<School, Long> {

}
