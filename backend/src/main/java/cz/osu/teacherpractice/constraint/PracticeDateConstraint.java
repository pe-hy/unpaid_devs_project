package cz.osu.teacherpractice.constraint;

import cz.osu.teacherpractice.validator.PracticeDateValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PracticeDateValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface PracticeDateConstraint {
    String message() default "bla bla bla";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
