package cz.osu.teacherpractice.validator;

import cz.osu.teacherpractice.annotation.constraint.PracticeTimeConstraint;
import cz.osu.teacherpractice.resources.request.NewPracticeTimeRequest;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PracticeTimeValidator implements ConstraintValidator<PracticeTimeConstraint, NewPracticeTimeRequest> {

    @Override
    public void initialize(PracticeTimeConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(NewPracticeTimeRequest newPracticeTimeRequest, ConstraintValidatorContext constraintValidatorContext) {
        int startInSeconds = newPracticeTimeRequest.getStart().toSecondOfDay();
        int endInSeconds = newPracticeTimeRequest.getEnd().toSecondOfDay();
        return startInSeconds < endInSeconds;
    }
}
