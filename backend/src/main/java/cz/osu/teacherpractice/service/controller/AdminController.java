package cz.osu.teacherpractice.service.controller;

import cz.osu.teacherpractice.dto.request.RegistrationDto;
import cz.osu.teacherpractice.service.AdminService;
import cz.osu.teacherpractice.service.UserService;
import cz.osu.teacherpractice.service.registration.RegistrationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AdminController {

    private final RegistrationService registrationService;
    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("")
    public String getAdmin(Principal principal) {
        return "Hi admin: " + principal.getName();
    }

    @PostMapping("/registerCoordinator")
    public String register(@RequestBody RegistrationDto request) {

        String ret = adminService.register(request);
        return ret;
    }
}
