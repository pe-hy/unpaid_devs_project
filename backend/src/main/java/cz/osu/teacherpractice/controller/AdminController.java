package cz.osu.teacherpractice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("")
    public String getAdmin(Principal principal) {
        return "Hi admin: " + principal.getName();
    }
}
