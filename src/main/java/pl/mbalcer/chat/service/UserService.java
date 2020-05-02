package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
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
        Optional<User> user = Optional.ofNullable(userRepository.findByLogin(login));
        if (user.isPresent())
            return user.get();
        else
            return null;
    }

    public UserDTO getUserDTOByLogin(String login) {
        Optional<User> user = Optional.ofNullable(userRepository.findByLogin(login));
        if (user.isPresent())
            return userMapper.convertToUserDTO(user.get());
        else
            return null;
    }

    public UserDTO getUserByEmail(String email) {
        Optional<User> user = Optional.ofNullable(userRepository.findByEmail(email));
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

    public UserDTO saveUser(UserDTO userDTO) {
        User user = userMapper.convertToUser(userDTO);
        return userMapper.convertToUserDTO(userRepository.save(user));
    }

    public UserDTO changeColor(UserDTO userDTO) {
        User user = getUserByLogin(userDTO.getLogin());
        user.setColor(userDTO.getColor());

        return userMapper.convertToUserDTO(userRepository.save(user));
    }

    public ResponseEntity<UserDTO> changePassword(UserDTO userDTO, String newPassword) {
        User user = getUserByLogin(userDTO.getLogin());
        if (user.getPassword().equals(userDTO.getPassword())) {
            user.setPassword(newPassword);
            userRepository.save(user);
            return new ResponseEntity<>(
                    userMapper.convertToUserDTO(user),
                    HttpStatus.OK);
        } else
            return new ResponseEntity<>(HttpStatus.CONFLICT);
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
}
