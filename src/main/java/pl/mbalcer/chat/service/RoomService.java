package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.dto.RoomDTO;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.exception.UserNotFoundException;
import pl.mbalcer.chat.mapper.RoomMapper;
import pl.mbalcer.chat.mapper.UserMapper;
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
    private UserMapper userMapper;

    @Autowired
    public RoomService(RoomRepository roomRepository, UserRepository userRepository, RoomMapper roomMapper, UserMapper userMapper) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.roomMapper = roomMapper;
        this.userMapper = userMapper;
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
                .map(u -> userRepository.findByLogin(u.getLogin()).get()) // TODO optional
                .collect(Collectors.toList());
        saveRoom.setUsers(users);
        Room room = roomRepository.save(saveRoom);
        return roomMapper.convertToRoomDTO(room);
    }

    public List<String> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(r -> r.getName())
                .collect(Collectors.toList());
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

    public List<UserDTO> getUsersInRoom(String room) {
        if(room.equals("All"))
            return userRepository.findAll()
                    .stream()
                    .map(u -> userMapper.convertToUserDTO(u))
                    .collect(Collectors.toList());
        else
            return roomRepository.getRoomByName(room)
                .getUsers()
                .stream()
                .map(u -> userMapper.convertToUserDTO(u))
                .collect(Collectors.toList());
    }

    public void addUserToRoom(String login, String nameRoom) {
        if (getRoomByUser(login).stream().noneMatch(r -> r.equals(nameRoom))) {
            User user = userRepository.findByLogin(login).orElseThrow(UserNotFoundException::new);
            Room room = roomRepository.getRoomByName(nameRoom);

            room.addUser(user);
            roomRepository.save(room);
        }
    }

    public void removeUserFromRoom(String login, String nameRoom) {
        User user = userRepository.findByLogin(login).orElseThrow(UserNotFoundException::new);
        Room room = roomRepository.getRoomByName(nameRoom);

        if (room.getUsers().size() == 1) {
            roomRepository.delete(room);
        } else {
            room.removeUser(user);
            roomRepository.save(room);
        }
    }
}
