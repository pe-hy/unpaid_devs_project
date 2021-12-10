package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.resources.request.NewPracticeRequest;

public interface TeacherService {
    void addPractice(String teacherUsername, NewPracticeRequest practiceRequest);
}
