package cz.osu.teacherpractice.constraint.validator;

import cz.osu.teacherpractice.constraint.annotation.DateStartsAfter;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class DateStartsAfterValidator implements ConstraintValidator<DateStartsAfter, LocalDate> {

    private int days;

    @Override
    public void initialize(DateStartsAfter constraintAnnotation) {
        this.days = constraintAnnotation.days();
    }

    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext constraintValidatorContext) {
        if (date == null) {
            return true;
        }

        boolean isEqualNow = date.minusDays(days).isEqual(LocalDate.now());
        boolean isAfterNow = date.minusDays(days).isAfter(LocalDate.now());

        return isEqualNow || isAfterNow;
    }
}