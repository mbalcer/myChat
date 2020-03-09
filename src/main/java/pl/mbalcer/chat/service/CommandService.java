package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.mapper.UserMapper;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.model.MessageType;

import java.util.regex.Pattern;

@Service
public class CommandService {
    private final String PATTERN_TEST_CMD = "^\\/{1}test$";
    private final String PATTERN_HELP_CMD = "^\\/{1}help$";
    private final String PATTERN_CLEAR_CMD = "^\\/{1}clear$";
    private final String PATTERN_CHANGE_COLOR_CMD = "^\\/{1}color\\s{1}#[0-9a-fA-F]{6}$";
    private final String PATTERN_ADD_USER_CMD = "^\\/{1}add\\s{1}\\w{4,}$";
    private final String PATTERN_ALERT_CMD = "^\\/{1}alert\\s{1}.{4,}$";

    private UserService userService;
    private UserMapper userMapper;
    private RoomService roomService;

    @Autowired
    public CommandService(UserService userService, UserMapper userMapper, RoomService roomService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.roomService = roomService;
    }

    public Message checkMessage(Message message) {
        Pattern checkMessageIsCommand = Pattern.compile("^\\/{1}.{4,}");
        if (checkMessageIsCommand.matcher(message.getMessage()).matches()) {
            if (matchRegex(PATTERN_TEST_CMD, message.getMessage()))
                message = testCmd(message);
            else if (matchRegex(PATTERN_HELP_CMD, message.getMessage()))
                message = helpCmd(message);
            else if (matchRegex(PATTERN_CLEAR_CMD, message.getMessage()))
                message = clearCmd(message);
            else if (matchRegex(PATTERN_CHANGE_COLOR_CMD, message.getMessage()))
                message = changeColorCmd(message);
            else if (matchRegex(PATTERN_ADD_USER_CMD, message.getMessage()))
                message = addUserCmd(message);
            else if (matchRegex(PATTERN_ALERT_CMD, message.getMessage()))
                message = alertCmd(message);
        } else {
            message.setType(MessageType.MESSAGE);
        }
        return message;
    }

    private boolean matchRegex(String regex, String text) {
        return Pattern.compile(regex).matcher(text).matches();
    }

    private Message testCmd(Message message) {
        message.setType(MessageType.SYSTEM);
        message.setMessage("TEST COMMAND");
        return message;
    }

    private Message helpCmd(Message message) {
        message.setType(MessageType.HELP);
        message.setMessage("Hi " + message.getUser().getLogin() + ". In this application you can writing with your friends and other people. " +
                "On the left you have a list of room. You can add new room, add users to room and leave from its. " +
                "If you want change color your username or change password you must click on person icon. Thanks for being with us.");
        return message;
    }

    private Message clearCmd(Message message) {
        message.setType(MessageType.CLEAR);
        message.setMessage("Messages have been cleared");
        return message;
    }

    private Message changeColorCmd(Message message) {
        String color = message.getMessage().split(" ")[1];
        UserDTO user = userMapper.convertToUserDTO(message.getUser());
        user.setColor(color);
        userService.changeColor(user);

        message.setType(MessageType.SYSTEM);
        message.setMessage("The color has been changed correctly");
        return message;
    }

    private Message addUserCmd(Message message) {
        if (message.getRoom().equals("All"))
            return error(message, "You cannot add people to the room All");

        String user = message.getMessage().split(" ")[1];
        if (userService.getUserByLogin(user) == null)
            return error(message, "No user with nickname: " + user);

        roomService.addUserToRoom(user, message.getRoom());
        message.setMessage("Added the user " + user + " to room " + message.getRoom());
        message.setType(MessageType.SYSTEM);
        return message;
    }

    private Message alertCmd(Message message) {
        String alertMessage = message.getMessage().substring(7);
        message.setMessage(alertMessage);
        message.setType(MessageType.ALERT);
        return message;
    }

    private Message error(Message message, String errorMessage) {
        message.setMessage(errorMessage);
        message.setType(MessageType.ERROR);
        return message;
    }
}
