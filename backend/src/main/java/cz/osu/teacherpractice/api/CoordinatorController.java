package cz.osu.teacherpractice.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coordinator")
public class CoordinatorController {
    @GetMapping("")
    public String getCoordinator() {
        return "Hi coordinator";
    }
}
