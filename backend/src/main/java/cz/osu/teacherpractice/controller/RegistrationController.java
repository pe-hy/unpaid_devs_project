package cz.osu.teacherpractice.controller;

import cz.osu.teacherpractice.service.RegistrationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import cz.osu.teacherpractice.dto.request.RegistrationDto;

@RestController
@RequestMapping(path = "/register")
@AllArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public String register(@RequestBody RegistrationDto request) {

        String ret = registrationService.register(request);
        System.out.println(ret);
        return ret;
    }

//    @GetMapping(path = "confirm")
//    public String confirm(@RequestParam("token") String token) {
//        return registrationService.confirmToken(token);
//    }

}
