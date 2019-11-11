package pl.mbalcer.chat.mapper;

import org.springframework.stereotype.Component;
import pl.mbalcer.chat.dto.RoomDTO;
import pl.mbalcer.chat.model.Room;

@Component
public class RoomMapper {

    public RoomDTO convertToRoomDTO(Room room) {
        return new RoomDTO(room.getName(), room.getUsers());
    }

    public Room convertToRoomEntity(RoomDTO roomDTO) {
        return new Room(null, roomDTO.getName(), roomDTO.getUsers());
    }
}
