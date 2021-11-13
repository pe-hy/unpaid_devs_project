package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repo.SchoolRepo;
import cz.osu.teacherpractice.repo.SubjectRepo;
import cz.osu.teacherpractice.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepo userRepo;
    private final SubjectRepo subjectRepo;
    private final SchoolRepo schoolRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User saveUser(User user) {
        log.info("Saving user \"{}\" to database", user.getUsername());

        if (userRepo.findByUsername(user.getUsername()) != null) {
            throw new IllegalStateException("User \"" + user.getUsername() + "\" already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepo.save(user);
    }

    @Override
    public User getUser(Long id) {
        log.info("Fetching user with id \"{}\" from database", id);
        return userRepo.findById(id).orElseThrow(() -> new IllegalStateException(
                "Student with id " + id + " not found."
        ));
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users from database");
        return userRepo.findAll();
    }

    @Override
    public List<String> getSubjects() {
        log.info("Fetching all subjects from database");
        return subjectRepo.findAll().stream().map(Subject::getName).collect(Collectors.toList());
    }

    @Override
    public List<String> getSchools() {
        log.info("Fetching all schools from database");
        return schoolRepo.findAll().stream().map(School::getName).collect(Collectors.toList());
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Fetching user \"{}\" from database", username);
        User user = userRepo.findByUsername(username);
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getCode());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), List.of(authority));
    }
}
