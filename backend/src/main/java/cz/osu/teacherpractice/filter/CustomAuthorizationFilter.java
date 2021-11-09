package cz.osu.teacherpractice.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/login") || request.getServletPath().equals("/register")) {
            filterChain.doFilter(request, response);
        } else {
            log.info("Authorization handling");
            // use stream api instead
            Cookie[] cookies = request.getCookies();

            if (cookies != null) {
                for (Cookie c : cookies) {
                    if (c.getName().equals("access_token")) {
                        try {
                            String token = c.getValue();
                            // repeating code (see CustomAuthenticationFilter)
                            Algorithm algorithm = Algorithm.HMAC256("secret-word");
                            JWTVerifier verifier = JWT.require(algorithm).build();
                            DecodedJWT decodedJWT = verifier.verify(token);
                            String username = decodedJWT.getSubject();
                            String role = decodedJWT.getClaim("role").as(String.class);
                            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);
                            UsernamePasswordAuthenticationToken authenticationToken =
                                    new UsernamePasswordAuthenticationToken(username, null, List.of(authority));
                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                            filterChain.doFilter(request, response);
                        } catch (Exception e) {
                            log.error(e.getMessage());
                            response.setStatus(FORBIDDEN.value());
                            response.setContentType(APPLICATION_JSON_VALUE);
                            Map<String, String> error = Map.of("error_msg", e.getMessage());
                            new ObjectMapper().writeValue(response.getOutputStream(), error);
                        }
                    } else {
                        filterChain.doFilter(request, response);
                    }
                }
            }
        }
    }
}
