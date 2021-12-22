package cz.osu.teacherpractice.constraint.annotation;

import cz.osu.teacherpractice.constraint.validator.IntegerRangeValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = IntegerRangeValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface IntegerRange {

    int min();
    int max();

    String message() default "integer.invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
