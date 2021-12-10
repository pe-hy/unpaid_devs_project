package cz.osu.teacherpractice.validator;

import cz.osu.teacherpractice.constraint.PracticeDateConstraint;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class PracticeDateValidator implements ConstraintValidator<PracticeDateConstraint, LocalDate> {

    @Override
    public void initialize(PracticeDateConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext constraintValidatorContext) {
        return LocalDate.now().plusDays(7).isAfter(date);
    }
}