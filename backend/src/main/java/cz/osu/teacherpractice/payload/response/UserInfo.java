package cz.osu.teacherpractice.payload.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data @NoArgsConstructor
public class UserInfo {
    private String username;
    private String firstName;
    private String secondName;
    private String schoolName;

    public UserInfo(String username) {
        this.username = username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserInfo userInfo = (UserInfo) o;
        return Objects.equals(username, userInfo.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}
