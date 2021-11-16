package cz.osu.teacherpractice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

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

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private User teacher;

    @ManyToOne
    private User student;
}
