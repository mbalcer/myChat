package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.dto.RoomDTO;
import pl.mbalcer.chat.mapper.RoomMapper;
import pl.mbalcer.chat.model.Room;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.RoomRepository;
import pl.mbalcer.chat.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private RoomRepository roomRepository;
    private UserRepository userRepository;
    private RoomMapper roomMapper;

    @Autowired
    public RoomService(RoomRepository roomRepository, UserRepository userRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.roomMapper = roomMapper;
    }

    public RoomDTO getRoomByName(String name) {
        Optional<Room> room = Optional.ofNullable(roomRepository.getRoomByName(name));
        if (room.isPresent())
            return roomMapper.convertToRoomDTO(room.get());
        else
            return null;
    }

    public RoomDTO saveRoom(RoomDTO roomDTO) {
        Room saveRoom = roomMapper.convertToRoomEntity(roomDTO);
        List<User> users = saveRoom.getUsers()
                .stream()
                .map(u -> userRepository.findByLogin(u.getLogin()))
                .collect(Collectors.toList());
        saveRoom.setUsers(users);
        Room room = roomRepository.save(saveRoom);
        return roomMapper.convertToRoomDTO(room);
    }

    public List<String> getRoomByUser(String user) {
        List<Room> allRooms = roomRepository.findAll();
        List<Room> userRooms = allRooms.stream()
                .filter(r -> r.getUsers()
                        .stream()
                        .filter(u -> u.getLogin().equals(user))
                        .findAny()
                        .orElse(null)
                        != null)
                .collect(Collectors.toList());

        return userRooms.stream()
                .map(r -> r.getName())
                .collect(Collectors.toList());
    }

    public void addUserToRoom(String login, String nameRoom) {
        User user = userRepository.findByLogin(login);
        Room room = roomRepository.getRoomByName(nameRoom);

        room.addUser(user);
        roomRepository.save(room);
    }

    public void removeUserFromRoom(String login, String nameRoom) {
        User user = userRepository.findByLogin(login);
        Room room = roomRepository.getRoomByName(nameRoom);

        room.removeUser(user);
        roomRepository.save(room);
    }
}