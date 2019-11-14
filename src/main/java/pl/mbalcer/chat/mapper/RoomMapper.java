package pl.mbalcer.chat.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.mbalcer.chat.dto.RoomDTO;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.model.Room;
import pl.mbalcer.chat.model.User;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RoomMapper {
    @Autowired
    private UserMapper userMapper;

    public RoomDTO convertToRoomDTO(Room room) {
        List<UserDTO> users = room.getUsers()
                .stream()
                .map(u -> userMapper.convertToUserDTO(u))
                .collect(Collectors.toList());

        return new RoomDTO(room.getName(), users);
    }

    public Room convertToRoomEntity(RoomDTO roomDTO) {
        List<User> users = roomDTO.getUsers()
                .stream()
                .map(u -> userMapper.convertToUser(u))
                .collect(Collectors.toList());

        return new Room(null, roomDTO.getName(), users);
    }
}
