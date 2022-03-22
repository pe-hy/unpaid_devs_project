package cz.osu.teacherpractice.email;

import cz.osu.teacherpractice.model.Role;
import org.springframework.stereotype.Service;

import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailValidator {

    public static final Pattern VALID_EMAIL_ADDRESS_REGEX_STUDENT =
            Pattern.compile("^[A-Za-z0-9._%+-]+@student.osu.cz$", Pattern.CASE_INSENSITIVE);
    public static final Pattern VALID_EMAIL_ADDRESS_REGEX_TEACHER =
            Pattern.compile("^(.+)@(.+)$", Pattern.CASE_INSENSITIVE);

    public boolean checkEmail(String s, String role) {
        System.out.println(s + " " + role);
        Matcher matcher;
        if(role.equals("student")) {
            matcher = VALID_EMAIL_ADDRESS_REGEX_STUDENT.matcher(s);
        }else{
            matcher = VALID_EMAIL_ADDRESS_REGEX_TEACHER.matcher(s);
        }
        return matcher.find();
    }
}
