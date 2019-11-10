package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.mapper.UserMapper;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    @GetMapping("/byLogin/{login}")
    public UserDTO getUserByLogin(@PathVariable String login) {
        User user = userRepository.findByLogin(login);
        if (user == null)
            return null;
        else
            return userMapper.convertToUserDTO(user);
    }

    @PostMapping
    public UserDTO saveUser(@RequestBody UserDTO user) {
        User saveUser = userMapper.convertToUser(user);
        return userMapper.convertToUserDTO(userRepository.save(saveUser));
    }

    @GetMapping("/all")
    public List<UserDTO> findAll() {
        List<User> users = userRepository.findAll();
        return users.stream().map(u -> userMapper.convertToUserDTO(u)).collect(Collectors.toList());
    }

    @GetMapping("/byEmail/{email}")
    public UserDTO getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user == null)
            return null;
        else
            return userMapper.convertToUserDTO(user);
    }
}
