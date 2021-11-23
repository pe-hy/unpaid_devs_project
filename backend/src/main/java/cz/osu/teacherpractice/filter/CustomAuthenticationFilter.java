package cz.osu.teacherpractice.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.osu.teacherpractice.payload.request.UserLoginRequest;
import lombok.extern.slf4j.Slf4j;
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

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = null;
        String password = null;

        try {
            UserLoginRequest login = new ObjectMapper().readValue(request.getInputStream(), UserLoginRequest.class);
            username = login.getUsername();
            password = login.getPassword();
            log.info("User \"{}\" with password \"{}\" is trying to log in", username, password);
        } catch (IOException e) {
            log.error(e.getMessage());
        }

        if (username == null || password == null) {
            throw new AuthenticationCredentialsNotFoundException("Username or password equals null");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException {
        User user = (User) authResult.getPrincipal();
        String role = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()).get(0);
        log.info("User \"{}\" with role \"{}\" successfully logged in", user.getUsername(), role);

        // secret key should be encrypted and stored on a more secure place
        Algorithm algorithm = Algorithm.HMAC256("secret-key");
        Date expirationDate = Date.from(LocalDate.now().plusDays(14).atStartOfDay(ZoneId.systemDefault()).toInstant());

        // would be possible to create refresh token as well
        String access_token = JWT.create().withSubject(user.getUsername())
                .withExpiresAt(expirationDate)
                .withIssuer(request.getRequestURL().toString())
                .withClaim("role", role)
                .sign(algorithm);

        // return jwt token as cookie
        Cookie cookie = new Cookie("access_token", access_token);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        // provide role for client as json
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), Map.of("role", role));
    }
}
