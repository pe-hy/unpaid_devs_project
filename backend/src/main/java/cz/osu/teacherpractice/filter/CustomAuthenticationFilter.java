package cz.osu.teacherpractice.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.osu.teacherpractice.dto.request.UserLoginDto;
import cz.osu.teacherpractice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

import static cz.osu.teacherpractice.config.SecurityConfig.*;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final Algorithm jwtAlgorithm;
    private final UserRepository userRepository;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager, Algorithm jwtAlgorithm, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtAlgorithm = jwtAlgorithm;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            UserLoginDto login = new ObjectMapper().readValue(request.getInputStream(), UserLoginDto.class);
            String username = login.getUsername();
            String password = login.getPassword();
            if (username == null) {
                throw new AuthenticationCredentialsNotFoundException("Uživatelské jméno nevyplněno");
            }
            if (password == null) {
                throw new AuthenticationCredentialsNotFoundException("Heslo nevyplněno");
            }
            if (userRepository.findByEmail(username).isPresent()){
                if(!userRepository.findByEmail(username).get().getEnabled()){
                    throw new AuthenticationCredentialsNotFoundException("Chybné přihlášení");
                }
                if(userRepository.findByEmail(username).get().getLocked()){
                    throw new AuthenticationCredentialsNotFoundException("Účet byl zablokován");
                }
            }
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            return authenticationManager.authenticate(authenticationToken);
        } catch (IOException e) {
            throw new AuthenticationCredentialsNotFoundException("Překlep v atributech username nebo password");
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException {
        User user = (User) authResult.getPrincipal();
        String role = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()).get(0);

        Date expirationDate = Date.from(LocalDate.now().plusDays(JWT_TOKEN_EXPIRATION_DAYS).atStartOfDay(ZoneId.systemDefault()).toInstant());

        // would be possible to create refresh token as well
        String access_token = JWT.create().withSubject(user.getUsername())
                .withExpiresAt(expirationDate)
                .withIssuer(request.getRequestURL().toString())
                .withClaim("role", role)
                .sign(jwtAlgorithm);

        // return jwt token as cookie
        Cookie cookie = new Cookie(COOKIE_NAME, access_token);
        cookie.setMaxAge(COOKIE_EXPIRATION_SECONDS);
        cookie.setHttpOnly(COOKIE_HTTP_ONLY);
        cookie.setSecure(COOKIE_SECURE);
        response.addCookie(cookie);

        // provide role for client as json
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), Map.of("role", role));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        response.setContentType(APPLICATION_JSON_VALUE);

        if (failed instanceof AuthenticationCredentialsNotFoundException) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            new ObjectMapper().writeValue(response.getOutputStream(), Map.of("message", failed.getMessage()));
        } else {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            new ObjectMapper().writeValue(response.getOutputStream(), Map.of("message", "Neplatné přihlašovací údaje"));
        }
    }
}
