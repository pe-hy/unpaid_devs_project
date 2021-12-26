package cz.osu.teacherpractice.exception.handler;

import cz.osu.teacherpractice.exception.ServerErrorException;
import cz.osu.teacherpractice.exception.UserErrorException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@ControllerAdvice
public class CustomExceptionHandler {

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected List<ErrorMessage> handleValidationException(MethodArgumentNotValidException e) {

        return e.getFieldErrors().stream()
                .map(ErrorMessage::new)
                .collect(Collectors.toList());
    }

    @ResponseBody
    @ResponseStatus(BAD_REQUEST)
    @ExceptionHandler(UserErrorException.class)
    protected ErrorMessage handleUserErrorException(UserErrorException e) {
        return new ErrorMessage(e);
    }

    @ResponseBody
    @ResponseStatus(INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ServerErrorException.class)
    protected void handleServerErrorException(ServerErrorException e) {}
}
