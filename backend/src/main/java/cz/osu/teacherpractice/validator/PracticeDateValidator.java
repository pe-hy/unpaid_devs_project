package cz.osu.teacherpractice.validator;

import cz.osu.teacherpractice.annotation.constraint.PracticeDateConstraint;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDate;

import static cz.osu.teacherpractice.config.AppConfig.CREATE_PRACTICE_DAYS_LEFT;

public class PracticeDateValidator implements ConstraintValidator<PracticeDateConstraint, LocalDate> {

    @Override
    public void initialize(PracticeDateConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext constraintValidatorContext) {
        return !LocalDate.now().plusDays(CREATE_PRACTICE_DAYS_LEFT).isAfter(date);
    }
}