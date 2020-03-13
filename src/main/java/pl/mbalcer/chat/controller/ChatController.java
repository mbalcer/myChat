package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.service.ChatService;

import java.util.List;

@RestController
@CrossOrigin
public class ChatController {
    private ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat/{room}")
    @SendTo("/topic/{room}")
    public Message getMessage(@DestinationVariable String room, Message message) {
        return chatService.processMessage(message, room);
    }

    @GetMapping("/api/chat/{room}/{login}")
    public List<Message> getMessagesByRooms(@PathVariable String room, @PathVariable String login) {
        return chatService.getMessagesByRoomAndLogin(room, login);
    }
}
