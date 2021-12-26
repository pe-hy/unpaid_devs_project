package cz.osu.teacherpractice.exception;

public class ServerErrorException extends RuntimeException {

    public ServerErrorException() {
    }

    public ServerErrorException(String message) {
        super(message);
    }
}
