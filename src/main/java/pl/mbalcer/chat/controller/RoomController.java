package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.mbalcer.chat.dto.RoomDTO;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.service.RoomService;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@CrossOrigin
public class RoomController {
    private RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/byName/{name}")
    public RoomDTO getRoomByName(@PathVariable String name) {
        return roomService.getRoomByName(name);
    }

    @PostMapping
    public RoomDTO save(@RequestBody RoomDTO roomDTO) {
        return roomService.saveRoom(roomDTO);
    }

    @GetMapping("/byUser/{user}")
    public List<String> getRoomByUser(@PathVariable String user) {
        return roomService.getRoomByUser(user);
    }

    @PutMapping("/add/{nameRoom}")
    public void addUserToRoom(@PathVariable String nameRoom, @RequestBody UserDTO userDTO) {
        roomService.addUserToRoom(userDTO.getLogin(), nameRoom);
    }

    @PutMapping("/remove/{nameRoom}")
    public void removeUserFromRoom(@PathVariable String nameRoom, @RequestBody UserDTO userDTO) {
        roomService.removeUserFromRoom(userDTO.getLogin(), nameRoom);
    }

    @GetMapping("/users-list/{room}")
    public List<UserDTO> getUsersList(@PathVariable String room) {
        return this.roomService.getUsersInRoom(room);
    }
}
