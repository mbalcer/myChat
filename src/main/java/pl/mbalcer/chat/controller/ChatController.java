package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.service.CommandService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class ChatController {

    private List<Message> historyOfMessage = new ArrayList<>();
    private CommandService commandService;

    @Autowired
    public ChatController(CommandService commandService) {
        this.commandService = commandService;
    }

    @MessageMapping("/chat/{room}")
    public Message getMessage(@DestinationVariable String room, Message message) {
        message.setDateTime(LocalDateTime.now());
        message = this.commandService.checkMessage(message);
        historyOfMessage.add(message);
        return message;
    }

    @GetMapping("/api/chat/{room}")
    public List<Message> getMessagesByRooms(@PathVariable String room) {
        return historyOfMessage.stream().filter(r -> r.getRoom().equals(room)).collect(Collectors.toList());
    }
}
