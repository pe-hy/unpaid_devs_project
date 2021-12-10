package cz.osu.teacherpractice.annotation.constraint;

import cz.osu.teacherpractice.validator.PracticeTimeValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PracticeTimeValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface PracticeTimeConstraint {
    String message() default "Čas začátku praxe musí předcházet času konce praxe.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}