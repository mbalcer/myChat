package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.mbalcer.chat.dto.RoomDTO;
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
}
