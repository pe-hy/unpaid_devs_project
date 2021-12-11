package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.model.Role;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;

import java.util.List;

public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    User getUserByUsername(String username);
    Role getUserRole(String username);
    List<User> getAllUsers();
    List<Subject> getSubjects();
    List<School> getSchools();
}
