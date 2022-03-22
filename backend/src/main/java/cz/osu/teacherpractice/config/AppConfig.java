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
    public static final int CONFIRMATION_TOKEN_EXPIRY_TIME = 10; // minutes
    public static final String CONFIRMATION_EMAIL_ADDRESS = "teacherpracticeconfirmator@seznam.cz";
}
