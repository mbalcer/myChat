package pl.mbalcer.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.model.MessageType;
import pl.mbalcer.chat.service.CommandService;
import pl.mbalcer.chat.service.RoomService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class ChatController {

    private List<Message> historyOfMessage = new ArrayList<>();
    private CommandService commandService;
    private SimpMessagingTemplate simpMessagingTemplate;
    private RoomService roomService;

    @Autowired
    public ChatController(CommandService commandService, SimpMessagingTemplate simpMessagingTemplate, RoomService roomService) {
        this.commandService = commandService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.roomService = roomService;
    }

    @MessageMapping("/chat/{room}")
    @SendTo("/topic/{room}")
    public Message getMessage(@DestinationVariable String room, Message message) {
        message.setDateTime(LocalDateTime.now());
        message = this.commandService.checkMessage(message);
        if (message.getType().equals(MessageType.ALERT)) {
            List<String> allRooms = roomService.getAllRooms();
            allRooms.add("All");
            for (String nameRoom : allRooms) {
                if (!nameRoom.equals(room)) {
                    Message copyMessage = new Message(message.getUser(), nameRoom, message.getDateTime(), message.getType(), message.getMessage());
                    simpMessagingTemplate.convertAndSend("/topic/" + nameRoom, copyMessage);
                    historyOfMessage.add(copyMessage);
                }
            }
        }
        historyOfMessage.add(message);
        return message;
    }

    @GetMapping("/api/chat/{room}/{login}")
    public List<Message> getMessagesByRooms(@PathVariable String room, @PathVariable String login) {
        return historyOfMessage.stream()
                .filter(r -> r.getRoom().equals(room))
                .filter(m -> (m.getType().equals(MessageType.MESSAGE)) ||
                        (m.getType().equals(MessageType.ALERT)) ||
                        ((m.getType().equals(MessageType.SYSTEM) || m.getType().equals(MessageType.HELP) || m.getType().equals(MessageType.ERROR)) && m.getUser().getLogin().equals(login)))
                .collect(Collectors.toList());
    }
}
