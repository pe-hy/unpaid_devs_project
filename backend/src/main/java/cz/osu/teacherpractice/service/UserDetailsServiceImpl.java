package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.model.User;
import cz.osu.teacherpractice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(
                "Uživatel '" + username + "' nenalezen."
        ));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getCode());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), List.of(authority));
    }
}