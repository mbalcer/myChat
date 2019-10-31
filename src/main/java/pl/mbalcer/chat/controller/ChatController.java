package pl.mbalcer.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import pl.mbalcer.chat.model.Message;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message getMessage(Message message) {
        System.out.println(message.getMessage());
        message.setDateTime(LocalDateTime.now());
        return message;
    }
}
