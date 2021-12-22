package cz.osu.teacherpractice.exception.handler;

import cz.osu.teacherpractice.exception.UserException;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ControllerAdvice
public class CustomExceptionHandler {

    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<?> handleValidationException(MethodArgumentNotValidException e) {
        List<ErrorMessage> errorMessageList = e.getFieldErrors().stream()
                .map(ErrorMessage::new)
                .collect(Collectors.toList());

        errorMessageList.addAll(e.getGlobalErrors().stream()
                .map(ErrorMessage::new)
                .collect(Collectors.toList())
        );

        return new ResponseEntity<>(errorMessageList, BAD_REQUEST);
    }

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(UserException.class)
    protected Map<String, String> handleUserException(UserException e) {
        return Map.of("message", e.getMessage());
    }

    @Data
    private static class ErrorMessage {
        private final String field;
        private final String message;

        public ErrorMessage(FieldError fieldError) {
            field = fieldError.getField();
            message = fieldError.getDefaultMessage();
        }

        public ErrorMessage(ObjectError objectError) {
            field = objectError.getObjectName();
            message = objectError.getDefaultMessage();
        }
    }
}
