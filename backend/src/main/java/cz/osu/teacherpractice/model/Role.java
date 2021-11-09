package cz.osu.teacherpractice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

@AllArgsConstructor @Getter
public enum Role {
    STUDENT("ROLE_STUDENT"), TEACHER("ROLE_TEACHER"), COORDINATOR("ROLE_COORDINATOR"), ADMIN("ROLE_ADMIN");

    @NonNull private String code;
}
