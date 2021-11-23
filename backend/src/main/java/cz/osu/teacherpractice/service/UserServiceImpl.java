package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.exception.ResourceNotFoundException;
import cz.osu.teacherpractice.exception.UserAlreadyExists;
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

@Service @RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepo userRepo;
    private final SubjectRepo subjectRepo;
    private final SchoolRepo schoolRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new UserAlreadyExists("User with username [" + user.getUsername() + "] already exists.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public User getUser(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException(
                "User with id [" + id + "] not found."
        ));
    }

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @Override
    public List<Subject> getSubjects() {
        return subjectRepo.findAll();
    }

    @Override
    public List<School> getSchools() {
        return schoolRepo.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(
                "User with username [" + username + "] not found."
        ));
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getCode());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), List.of(authority));
    }
}
