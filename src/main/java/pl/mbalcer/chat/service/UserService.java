package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.dto.SignInUserDTO;
import pl.mbalcer.chat.dto.SignUpUserDTO;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.mapper.UserMapper;
import pl.mbalcer.chat.model.Role;
import pl.mbalcer.chat.model.Room;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private UserRepository userRepository;
    private UserMapper userMapper;
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper, SimpMessagingTemplate simpMessagingTemplate) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public User getUserByLogin(String login) {
        Optional<User> user = userRepository.findByLogin(login);
        if (user.isPresent())
            return user.get();
        else
            return null;
    }

    public UserDTO getUserDTOByLogin(String login) {
        Optional<User> user = userRepository.findByLogin(login);
        if (user.isPresent())
            return userMapper.convertToUserDTO(user.get());
        else
            return null;
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(u -> userMapper.convertToUserDTO(u))
                .collect(Collectors.toList());
    }

    public UserDTO changeColor(UserDTO userDTO) {
        User user = getUserByLogin(userDTO.getLogin());
        user.setColor(userDTO.getColor());

        return userMapper.convertToUserDTO(userRepository.save(user));
    }

    public ResponseEntity<UserDTO> changePassword(UserDTO userDTO, String newPassword) {
        User user = getUserByLogin(userDTO.getLogin());
        user.setPassword(newPassword);
        userRepository.save(user);
        return new ResponseEntity<>(
                userMapper.convertToUserDTO(user),
                HttpStatus.OK);
    }

    public User changeRole(User user, Role role) {
        user.setRole(role);
        return userRepository.save(user);
    }

    public UserDTO setActiveUser(UserDTO userDTO) {
        User user = getUserByLogin(userDTO.getLogin());
        user.setActive(userDTO.isActive());
        user = userRepository.save(user);
        List<String> rooms = user.getRooms().stream().map(Room::getName).collect(Collectors.toList());
        rooms.add("All");
        rooms.stream().forEach(r -> {
            simpMessagingTemplate.convertAndSend("/users-list/" + r, true);
        });
        return userMapper.convertToUserDTO(user);
    }

    public ResponseEntity<UserDTO> signUp(SignUpUserDTO userDTO) {
        if (userRepository.findByLogin(userDTO.getLogin()).isPresent() || userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User newUser = new User(userDTO.getLogin(), userDTO.getPassword(), userDTO.getEmail(), userDTO.getColor(), Role.USER, false);
        newUser = userRepository.save(newUser);
        return new ResponseEntity<>(userMapper.convertToUserDTO(newUser), HttpStatus.OK);
    }

    public ResponseEntity<UserDTO> signIn(SignInUserDTO userDTO) {
        Optional<User> userByLogin = userRepository.findByLogin(userDTO.getLogin());
        if (!userByLogin.isPresent())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        if (!userByLogin.get().getPassword().equals(userDTO.getPassword()))
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

        UserDTO user = userMapper.convertToUserDTO(userByLogin.get());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

}
