package cz.osu.teacherpractice.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    public static final int MAKE_RESERVATION_DAYS_LEFT = 7;
    public static final int CANCEL_RESERVATION_DAYS_LEFT = 7;
    public static final int CREATE_PRACTICE_DAYS_LEFT = 7;
    public static final int PRACTICE_MIN_CAPACITY = 1;
    public static final int PRACTICE_MAX_CAPACITY = 10;
    public static final int PRACTICE_NOTE_MAX_LENGTH = 250;
}
