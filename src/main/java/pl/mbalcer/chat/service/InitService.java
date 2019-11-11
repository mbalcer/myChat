package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.Room;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.RoomRepository;
import pl.mbalcer.chat.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.util.Arrays;

@Service
public class InitService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @PostConstruct
    public void init() {
        User u1 = new User("Admin", "admin123", "admin@mychat.pl", "#00FFFF");
        User u2 = new User("Mateusz", "mati123", "mateusz75319@gmail.com", "#0000FF");
        Room room = new Room(1l, "room1", Arrays.asList(u1, u2));
        Room programming = new Room(2l, "Programming", Arrays.asList(u1));

        userRepository.save(u1);
        userRepository.save(u2);
        roomRepository.save(room);
        roomRepository.save(programming);
    }
}
