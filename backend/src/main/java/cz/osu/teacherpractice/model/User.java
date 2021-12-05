package cz.osu.teacherpractice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false, unique=true)
    private String username;
    private String password;
    private String firstName;
    private String secondName;
    private String phoneNumber;
    private Role role;

    @ManyToOne
    private School school;

    @OneToMany(mappedBy="teacher")
    private List<Practice> teacherPractices = new ArrayList<>();

    @ManyToMany(mappedBy="students")
    private List<Practice> studentPractices = new ArrayList<>();
}
