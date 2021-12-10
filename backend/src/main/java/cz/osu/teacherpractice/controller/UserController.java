package cz.osu.teacherpractice.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import cz.osu.teacherpractice.resources.response.SchoolInfo;
import cz.osu.teacherpractice.resources.response.SubjectInfo;
import cz.osu.teacherpractice.model.School;
import cz.osu.teacherpractice.model.Subject;
import cz.osu.teacherpractice.service.UserDetailsServiceImpl;
import cz.osu.teacherpractice.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController @RequiredArgsConstructor
public class UserController {

    private final UserDetailsServiceImpl userDetailsService;
    private final UserServiceImpl userService;
    private final ModelMapper modelMapper;

    @PostMapping("/register")
    public String registerUser() {
        return "Registration not implemented yet.";
    }

    @GetMapping("/user/roles")
    public Map<String, String> getUserRole(HttpServletRequest request) {
        // repeating code (see CustomAuthenticationFilter)
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        Optional<Cookie> access_token = Arrays.stream(cookies).filter(c -> c.getName().equals("access_token")).findFirst();

        if (access_token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        String token = access_token.get().getValue();

        Algorithm algorithm = Algorithm.HMAC256("secret-key");
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(token);

        String username = decodedJWT.getSubject();

        try {
            userDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        return Map.of("role", decodedJWT.getClaim("role").as(String.class));
    }

    @GetMapping("/user/subjects")
    public List<SubjectInfo> getSubjects() {
        return userService.getSubjects().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/schools")
    public List<SchoolInfo> getSchools() {
        return userService.getSchools().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private SubjectInfo convertToResponse(Subject subject) {
        return modelMapper.map(subject, SubjectInfo.class);
    }

    private SchoolInfo convertToResponse(School school) {
        return modelMapper.map(school, SchoolInfo.class);
    }
}
