package cz.osu.teacherpractice.exception;

import org.springframework.security.core.AuthenticationException;

public class IncorrectLoginAttributesException extends AuthenticationException {
    public IncorrectLoginAttributesException(String msg) {
        super(msg);
    }
}
