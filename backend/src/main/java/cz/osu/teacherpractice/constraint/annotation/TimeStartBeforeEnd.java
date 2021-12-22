package cz.osu.teacherpractice.constraint.annotation;

import cz.osu.teacherpractice.constraint.validator.TimeStartBeforeEndValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = TimeStartBeforeEndValidator.class)
@Target( { ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface TimeStartBeforeEnd {

    String start();
    String end();

    String message() default "time.invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
