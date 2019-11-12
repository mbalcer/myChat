package pl.mbalcer.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import pl.mbalcer.chat.model.Message;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @MessageMapping("/chat/{room}")
    @SendTo("/topic/{room}")
    public Message getMessage(@DestinationVariable String room, Message message) {
        message.setDateTime(LocalDateTime.now());
        return message;
    }
}
