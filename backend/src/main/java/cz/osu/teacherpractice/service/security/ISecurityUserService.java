package cz.osu.teacherpractice.service.security;

public interface ISecurityUserService {

    boolean validatePasswordResetToken(String token);

}
