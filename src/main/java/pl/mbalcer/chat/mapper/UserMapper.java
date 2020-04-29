package pl.mbalcer.chat.mapper;

import org.springframework.stereotype.Component;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.model.User;

@Component
public class UserMapper {

    public UserDTO convertToUserDTO(User user) {
        return new UserDTO(user.getLogin(), user.getPassword(), user.getEmail(), user.getColor(), user.getRole(), user.isActive());
    }

    public User convertToUser(UserDTO userDTO) {
        return new User(userDTO.getLogin(), userDTO.getPassword(), userDTO.getEmail(), userDTO.getColor(), userDTO.getRole(), userDTO.isActive());
    }
}
