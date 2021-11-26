package cz.osu.teacherpractice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class Practice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(columnDefinition = "DATE")
    private LocalDate date;

    @Column(columnDefinition = "TIME")
    private LocalTime start;

    @Column(columnDefinition = "TIME")
    private LocalTime end;

    @Column(columnDefinition = "TEXT")
    private String note;

    private Integer capacity;

    private Integer currentlyRegistered;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private User teacher;

    @ManyToMany
    @JoinTable(
            name = "user_practice",
            joinColumns = @JoinColumn(name = "practice_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private List<User> students = new ArrayList<>();
}
