package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.SchoolDto;
import cz.osu.teacherpractice.service.RegistrationService;
import cz.osu.teacherpractice.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import cz.osu.teacherpractice.dto.request.RegistrationDto;

import java.util.List;

@RestController
@RequestMapping(path = "/register")
@AllArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserService userService;

    @PostMapping
    public String register(@RequestBody RegistrationDto request) {

        String ret = registrationService.register(request);
        System.out.println(ret);
        return ret;
    }

    @GetMapping("/schools")
    public List<SchoolDto> getSchools() {
        return userService.getSchools();
    }

    @GetMapping(path = "/confirm")
    public String confirm(@RequestParam("token") String token) {
        return registrationService.confirmToken(token);
    }

}
