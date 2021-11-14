package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.request.AddPracticeRequest;

public interface TeacherService {
    void addPractice(String teacherUsername, AddPracticeRequest practiceRequest);
}
