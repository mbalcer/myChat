package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.mbalcer.chat.dto.BanDTO;
import pl.mbalcer.chat.service.BanService;

import java.util.Optional;

@RestController
@RequestMapping("/ban")
@CrossOrigin
public class BanController {

    private BanService banService;

    @Autowired
    public BanController(BanService banService) {
        this.banService = banService;
    }

    @GetMapping("/now/byUser/{login}")
    public BanDTO checkBanNow(@PathVariable String login) {
        Optional<BanDTO> ban = banService.checkBanNow(login);
        if (ban.isPresent())
            return ban.get();
        else
            return null;
    }
}
