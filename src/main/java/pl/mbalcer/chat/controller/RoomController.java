package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.mbalcer.chat.dto.RoomDTO;
import pl.mbalcer.chat.mapper.RoomMapper;
import pl.mbalcer.chat.model.Room;
import pl.mbalcer.chat.model.User;
import pl.mbalcer.chat.repository.RoomRepository;
import pl.mbalcer.chat.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rooms")
@CrossOrigin
public class RoomController {
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoomMapper roomMapper;

    @GetMapping("/byName/{name}")
    public RoomDTO getRoomByName(@PathVariable String name) {
        Room room = roomRepository.getRoomByName(name);
        return roomMapper.convertToRoomDTO(room);
    }

    @PostMapping
    public RoomDTO save(@RequestBody RoomDTO roomDTO) {
        Room saveRoom = roomMapper.convertToRoomEntity(roomDTO);
        List<User> users = saveRoom.getUsers()
                .stream()
                .map(u -> userRepository.findByLogin(u.getLogin()))
                .collect(Collectors.toList());
        saveRoom.setUsers(users);
        Room room = roomRepository.save(saveRoom);
        return roomMapper.convertToRoomDTO(room);
    }

    @GetMapping("/byUser/{user}")
    public List<String> getRoomByUser(@PathVariable String user) {
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
}
