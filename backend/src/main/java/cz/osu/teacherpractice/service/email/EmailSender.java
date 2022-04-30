package cz.osu.teacherpractice.service.email;

public interface EmailSender {
    void send(String to, String email);
}
