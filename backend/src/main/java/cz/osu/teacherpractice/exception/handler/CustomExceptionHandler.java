package cz.osu.teacherpractice.exception.handler;

import cz.osu.teacherpractice.exception.UserException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class CustomExceptionHandler {

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected Map<String, String> handleSpringValidationExceptions(MethodArgumentNotValidException e, WebRequest request) {
        List<FieldError> errors = e.getBindingResult().getFieldErrors();

        // get the very first field validation error
        String message = errors.get(errors.size() - 1).getDefaultMessage();

        return Map.of("message", message);
    }

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(UserException.class)
    protected Map<String, String> handleUserExceptions(UserException e, WebRequest request) {
        return Map.of("message", e.getMessage());
    }
}
