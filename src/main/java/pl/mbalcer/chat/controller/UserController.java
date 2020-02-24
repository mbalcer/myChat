package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.mapper.UserMapper;
import pl.mbalcer.chat.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    private UserService userService;
    private UserMapper userMapper;

    @Autowired
    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("/byLogin/{login}")
    public UserDTO getUserByLogin(@PathVariable String login) {
        return userMapper.convertToUserDTO(userService.getUserByLogin(login));
    }

    @GetMapping("/byEmail/{email}")
    public UserDTO getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/all")
    public List<UserDTO> findAll() {
        return userService.getAllUsers();
    }

    @PostMapping
    public UserDTO saveUser(@RequestBody UserDTO user) {
        return userService.saveUser(user);
    }

    @PutMapping("/color")
    public UserDTO changeColor(@RequestBody UserDTO user) {
        return userService.changeColor(user);
    }

    @PutMapping("/password/{newPassword}")
    public ResponseEntity<UserDTO> changePassword(@PathVariable String newPassword, @RequestBody UserDTO user) {
        return userService.changePassword(user, newPassword);
    }
}
