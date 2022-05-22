package cz.osu.teacherpractice.domain;

import cz.osu.teacherpractice.dto.response.SubjectDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import cz.osu.teacherpractice.model.Review;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Data
public class PracticeDomain {
    private Long id;
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
    private String note;
    private Integer capacity;
    private SubjectDto subject;
    private UserDto teacher;
    private List<UserDto> students;
    private String report;
    private List<Review> reviews;
    private List<String> fileNames;
    private List<String> studentNames;

    @Setter(AccessLevel.NONE)
    private Integer numberOfReservedStudents;

    @Setter(AccessLevel.NONE)
    private Boolean isCurrentStudentReserved;

    public void setNumberOfReservedStudents() {
        this.numberOfReservedStudents = students.size();
    }

    public void setIsCurrentStudentReserved(String currentStudentUsername) {
        Optional<UserDto> currentStudent = students.stream()
                .filter(student -> currentStudentUsername.equals(student.getUsername()))
                .findAny();

        this.isCurrentStudentReserved = currentStudent.isPresent();
    }

    public boolean removePassedPractices() {
        //put date and end time into one variable
        LocalDateTime dateAndEnd = LocalDateTime.of(date, end);

        //if date and end time is in the past, remove practice
        if (LocalDateTime.now().isAfter(dateAndEnd)) {
            return false;
        }
        return true;
    }

    public boolean removeNotPassedPractices() {
        //put date and end time into one variable
        LocalDateTime dateAndEnd = LocalDateTime.of(date, end);

        //if date and end time is in the past, remove practice
        if (LocalDateTime.now().isAfter(dateAndEnd)) {
            return true;
        }
        return false;
    }

    public void setFileNames(List<String> list){
        this.fileNames = list;
    }

    public void setReport(String report) {this.report = report;}

    public void setStudentNames(List<String> list){
        this.studentNames = list;
    }

    public void setReviews(List<Review> list){this.reviews = list;}
}
