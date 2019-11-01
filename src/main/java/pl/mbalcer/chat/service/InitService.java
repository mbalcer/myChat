package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.UserRepository;

import javax.annotation.PostConstruct;

@Service
public class InitService {
    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        User u1 = new User(1l, "Admin", "admin123");

        userRepository.save(u1);
    }
}
