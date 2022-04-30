package cz.osu.teacherpractice.constraint.validator;

import cz.osu.teacherpractice.constraint.annotation.IntegerRange;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IntegerRangeValidator implements ConstraintValidator<IntegerRange, Integer> {

    private int min;
    private int max;

    @Override
    public void initialize(IntegerRange constraintAnnotation) {
        this.min = constraintAnnotation.min();
        this.max = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(Integer integer, ConstraintValidatorContext constraintValidatorContext) {
        if (integer == null) {
            return true;
        }

        return integer >= min && integer <= max;
    }
}
