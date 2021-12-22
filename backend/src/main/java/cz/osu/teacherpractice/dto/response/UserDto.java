package cz.osu.teacherpractice.dto.response;

import cz.osu.teacherpractice.dto.SchoolDto;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data @NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String firstName;
    private String secondName;
    private SchoolDto school;

    public UserDto(String username) {
        this.username = username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDto userDto = (UserDto) o;
        return Objects.equals(username, userDto.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}
