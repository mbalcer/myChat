package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.model.MessageType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private List<Message> historyOfMessage = new ArrayList<>();
    private CommandService commandService;
    private RoomService roomService;
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public ChatService(CommandService commandService, RoomService roomService, SimpMessagingTemplate simpMessagingTemplate) {
        this.commandService = commandService;
        this.roomService = roomService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void addToHistory(Message message) {
        this.historyOfMessage.add(message);
    }

    public Message processMessage(Message message, String room) {
        message.setDateTime(LocalDateTime.now());
        if(!message.getUser().getLogin().contains("guest")) {
            message = this.commandService.checkMessage(message);
            if (message.getType().equals(MessageType.ALERT)) {
                List<String> allRooms = roomService.getAllRooms();
                allRooms.add("All");
                for (String nameRoom : allRooms) {
                    if (!nameRoom.equals(room)) {
                        Message copyMessage = new Message(message.getUser(), nameRoom, message.getDateTime(), message.getType(), message.getMessage());
                        simpMessagingTemplate.convertAndSend("/topic/" + nameRoom, copyMessage);
                        addToHistory(copyMessage);
                    }
                }
            }
        } else {
            message.setType(MessageType.MESSAGE);
        }
        addToHistory(message);
        return message;
    }

    public List<Message> getMessagesByRoomAndLogin(String room, String login) {
        return historyOfMessage.stream()
                .filter(r -> r.getRoom().equals(room))
                .filter(m -> (m.getType().equals(MessageType.MESSAGE)) ||
                        (m.getType().equals(MessageType.ALERT)) ||
                        ((m.getType().equals(MessageType.SYSTEM) || m.getType().equals(MessageType.HELP) || m.getType().equals(MessageType.ERROR)) && m.getUser().getLogin().equals(login)))
                .collect(Collectors.toList());
    }
}
