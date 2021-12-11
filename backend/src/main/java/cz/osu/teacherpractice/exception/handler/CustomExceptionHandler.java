package cz.osu.teacherpractice.exception.handler;

import cz.osu.teacherpractice.exception.UserException;
import lombok.Data;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class CustomExceptionHandler {

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected List<ErrorMessage> handleSpringValidationExceptions(MethodArgumentNotValidException e) {
        return e.getBindingResult().getFieldErrors().stream()
                .map(this::toErrorMessage)
                .collect(Collectors.toList());
    }

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(UserException.class)
    protected Map<String, String> handleUserExceptions(UserException e) {
        return Map.of("message", e.getMessage());
    }

    @Data
    private static class ErrorMessage {
        private final String field;
        private final String message;
    }

    private ErrorMessage toErrorMessage(FieldError fieldError) {
        return new ErrorMessage(fieldError.getField(), fieldError.getDefaultMessage());
    }
}
