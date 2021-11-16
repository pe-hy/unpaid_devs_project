package cz.osu.teacherpractice.service;

import cz.osu.teacherpractice.dto.request.AddPracticeRequest;
import org.springframework.stereotype.Service;

public interface TeacherService {
    void addPractice(String teacherUsername, AddPracticeRequest practiceRequest);
}
