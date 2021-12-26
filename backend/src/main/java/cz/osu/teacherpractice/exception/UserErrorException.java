package cz.osu.teacherpractice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class UserErrorException extends RuntimeException {

    private String field = null;

    public UserErrorException() {
        super();
    }

    public UserErrorException(String message) {
        super(message);
    }

    public UserErrorException(String message, String field) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
