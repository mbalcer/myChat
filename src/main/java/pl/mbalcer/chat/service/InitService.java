package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.*;
import pl.mbalcer.chat.repository.BanRepository;
import pl.mbalcer.chat.repository.RoomRepository;
import pl.mbalcer.chat.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.Arrays;

@Service
public class InitService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BanRepository banRepository;

    @PostConstruct
    public void init() {
        User u1 = new User("Admin", "admin123", "admin@mychat.pl", "#00FFFF");
        u1.setRole(Role.ADMIN);
        User u2 = new User("Mateusz", "mati123", "mateusz75319@gmail.com", "#0000FF");
        Room room = new Room(1l, "room1", Arrays.asList(u1, u2));
        Room programming = new Room(2l, "Programming", Arrays.asList(u1));

        Ban b1 = new Ban(1l, LocalDateTime.now(), LocalDateTime.now().plusHours(3), BanType.BAN, u2);

        userRepository.save(u1);
        userRepository.save(u2);
        roomRepository.save(room);
        roomRepository.save(programming);
        banRepository.save(b1);
    }
}
