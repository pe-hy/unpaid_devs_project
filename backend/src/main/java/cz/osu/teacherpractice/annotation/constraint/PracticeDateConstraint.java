package cz.osu.teacherpractice.annotation.constraint;

import cz.osu.teacherpractice.validator.PracticeDateValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

import static cz.osu.teacherpractice.config.AppConfig.CREATE_PRACTICE_DAYS_LEFT;

@Documented
@Constraint(validatedBy = PracticeDateValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface PracticeDateConstraint {
    String message() default "Praxi je možné přidat nejpozději " + CREATE_PRACTICE_DAYS_LEFT + " dní předem.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
