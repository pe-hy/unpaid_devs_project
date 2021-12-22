package cz.osu.teacherpractice.constraint.validator;

import cz.osu.teacherpractice.constraint.annotation.TimeStartBeforeEnd;
import lombok.extern.slf4j.Slf4j;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;
import java.time.LocalTime;

@Slf4j
public class TimeStartBeforeEndValidator implements ConstraintValidator<TimeStartBeforeEnd, Object> {

    private String start;
    private String end;

    @Override
    public void initialize(TimeStartBeforeEnd constraintAnnotation) {
        start = constraintAnnotation.start();
        end = constraintAnnotation.end();
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext ctx) {
        if (object == null) {
            return true;
        }

        try {
            Field startField = object.getClass().getDeclaredField(this.start);
            startField.setAccessible(true);

            Field endField = object.getClass().getDeclaredField(this.end);
            endField.setAccessible(true);

            LocalTime start = (LocalTime) startField.get(object);
            LocalTime end = (LocalTime) endField.get(object);

            if (start == null || end == null) {
                return true;
            }

            ctx.disableDefaultConstraintViolation();
            ctx.buildConstraintViolationWithTemplate(ctx.getDefaultConstraintMessageTemplate())
                    .addPropertyNode(this.start)
                    .addConstraintViolation();

            return start.isBefore(end);

        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error(e.getClass().getName());
            return true;
        }
    }
}
