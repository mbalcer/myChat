package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.Ban;
import pl.mbalcer.chat.repository.BanRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BanService {
    private BanRepository banRepository;

    @Autowired
    public BanService(BanRepository banRepository) {
        this.banRepository = banRepository;
    }

    public Ban saveBan(Ban ban) {
        return banRepository.save(ban);
    }

    public List<Ban> getBansByUser(String login) {
        return banRepository.findAll()
                .stream()
                .filter(b -> b.getUser().getLogin().equals(login))
                .collect(Collectors.toList());
    }

    public Optional<Ban> checkBanNow(String login) {
        return getBansByUser(login).stream()
                .filter(b -> b.getStart().isBefore(LocalDateTime.now()) && b.getEnd().isAfter(LocalDateTime.now()))
                .findAny();
    }
}
