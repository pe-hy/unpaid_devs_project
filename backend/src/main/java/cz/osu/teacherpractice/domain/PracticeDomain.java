package cz.osu.teacherpractice.domain;

import cz.osu.teacherpractice.dto.SubjectDto;
import cz.osu.teacherpractice.dto.response.UserDto;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDate;
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
}
