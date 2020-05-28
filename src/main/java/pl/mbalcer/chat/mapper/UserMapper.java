package pl.mbalcer.chat.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.UserRepository;

@Component
public class UserMapper {

    @Autowired
    private UserRepository userRepository;

    public UserDTO convertToUserDTO(User user) {
        return new UserDTO(user.getLogin(), user.getEmail(), user.getColor(), user.getRole(), user.isActive());
    }

    public User convertToUser(UserDTO userDTO) {
        return userRepository.findByLogin(userDTO.getLogin()).get();
    }
}
