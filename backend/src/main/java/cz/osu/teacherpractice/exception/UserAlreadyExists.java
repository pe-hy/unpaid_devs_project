package cz.osu.teacherpractice.exception;

public class UserAlreadyExists extends RuntimeException {
    public UserAlreadyExists() {
        super();
    }

    public UserAlreadyExists(String message) {
        super(message);
    }
}
