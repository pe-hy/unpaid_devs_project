package cz.osu.teacherpractice.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    public static final int MAKE_RESERVATION_DAYS_LEFT = 7;
    public static final int CANCEL_RESERVATION_DAYS_LEFT = 7;
    public static final int CREATE_PRACTICE_DAYS_LEFT = 7;

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
