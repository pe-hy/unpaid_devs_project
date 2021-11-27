package cz.osu.teacherpractice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/coordinator")
public class CoordinatorController {

    @GetMapping("")
    public String getCoordinator(Principal principal) {
        return "Hi coordinator: " + principal.getName();
    }
}
