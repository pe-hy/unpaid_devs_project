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
    private Boolean locked = false;
    private Boolean enabled = false;

    @ManyToOne
    private School school;

    public User(String username, String password, String firstName, String secondName, String school, String phoneNumber, String role){
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.secondName = secondName;
        this.school = null; //TODO: implement school.
        this.phoneNumber = phoneNumber;


        if(role.equals("student")) {
            this.role = Role.STUDENT;
        }
        else if(role.equals("teacher")) {
            this.role = Role.TEACHER;
            this.locked = true;
        }
        else throw new IllegalStateException("Incorrect role that cannot be converted to enum.");
    }

    public User(String username, String password, String firstName, String secondName, School school, String phoneNumber, Role role){
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.secondName = secondName;
        this.school = school; //TODO: implement school.
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    @OneToMany(mappedBy="teacher")
    private List<Practice> teacherPractices = new ArrayList<>();

    @ManyToMany(mappedBy="students")
    private List<Practice> studentPractices = new ArrayList<>();
}
