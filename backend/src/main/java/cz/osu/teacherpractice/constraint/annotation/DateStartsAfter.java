package cz.osu.teacherpractice.constraint.annotation;

import cz.osu.teacherpractice.constraint.validator.DateStartsAfterValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = DateStartsAfterValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface DateStartsAfter {

    int days();

    String message() default "date.invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
