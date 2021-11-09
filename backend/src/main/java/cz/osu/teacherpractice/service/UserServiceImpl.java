package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor @Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    @Override
    public User saveUser(User user) {
        log.info("Saving user \"{}\" to database", user.getUsername());
        return userRepo.save(user);
    }

    @Override
    public User getUser(String username) {
        log.info("Fetching user \"{}\" from database", username);
        return userRepo.findByUsername(username);
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users from database");
        return userRepo.findAll();
    }
}
