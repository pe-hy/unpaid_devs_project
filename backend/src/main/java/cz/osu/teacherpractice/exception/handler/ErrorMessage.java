package cz.osu.teacherpractice.exception.handler;

import cz.osu.teacherpractice.exception.UserErrorException;
import lombok.Data;
import org.springframework.validation.FieldError;

@Data
public class ErrorMessage {
    private final String field;
    private final String message;

    public ErrorMessage(FieldError fieldError) {
        field = fieldError.getField();
        message = fieldError.getDefaultMessage();
    }

    public ErrorMessage(UserErrorException ex) {
        field = ex.getField();
        message = ex.getMessage();
    }
}
