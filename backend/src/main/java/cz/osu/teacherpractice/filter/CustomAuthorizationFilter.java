package cz.osu.teacherpractice.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.osu.teacherpractice.service.UserDetailsServiceImpl;
import cz.osu.teacherpractice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

public class CustomAuthorizationFilter extends OncePerRequestFilter {

    private final UserDetailsServiceImpl userDetailsService;
    private final Algorithm jwtAlgorithm;

    public CustomAuthorizationFilter(UserDetailsServiceImpl userDetailsService, Algorithm jwtAlgorithm) {
        this.userDetailsService = userDetailsService;
        this.jwtAlgorithm = jwtAlgorithm;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/login") || request.getServletPath().equals("/register") || request.getServletPath().equals("/register/confirm") || request.getServletPath().equals("/register/schools") || request.getServletPath().equals("/forgotPassword/reset") || request.getServletPath().equals("/forgotPassword/save")) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            Cookie[] cookies = request.getCookies();

            if (cookies == null) {
                throw new AuthenticationCredentialsNotFoundException("Je nutné se přihlásit.");
            }

            Optional<Cookie> access_token = Arrays.stream(cookies).filter(c -> c.getName().equals("access_token")).findFirst();

            if (access_token.isEmpty()) {
                throw new AuthenticationCredentialsNotFoundException("Je nutné se přihlásit.");
            }

            String token = access_token.get().getValue();

            JWTVerifier verifier = JWT.require(jwtAlgorithm).build();
            DecodedJWT decodedJWT = verifier.verify(token);

            String username = decodedJWT.getSubject();
            userDetailsService.loadUserByUsername(username);
            String role = decodedJWT.getClaim("role").as(String.class);
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(username, null, List.of(authority));

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            filterChain.doFilter(request, response);

        } catch (AuthenticationCredentialsNotFoundException | UsernameNotFoundException e) {
            response.setStatus(UNAUTHORIZED.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), Map.of("message", e.getMessage()));
        } catch (Exception e) {
            response.setStatus(FORBIDDEN.value());
            response.setContentType(APPLICATION_JSON_VALUE);
            new ObjectMapper().writeValue(response.getOutputStream(), Map.of("message", e.getMessage()));
        }
    }
}
