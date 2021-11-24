package cz.osu.teacherpractice.exception;

public class ReservationException extends RuntimeException {
    public ReservationException() {
        super();
    }
    public ReservationException(String message) {
        super(message);
    }
}
