package cz.osu.teacherpractice.service.security;

public interface ISecurityUserService {

    String validatePasswordResetToken(String token);

}
