package pl.mbalcer.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.mbalcer.chat.dto.UserDTO;
import pl.mbalcer.chat.mapper.UserMapper;
import pl.mbalcer.chat.model.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class CommandService {
    private UserService userService;
    private UserMapper userMapper;
    private RoomService roomService;
    private BanService banService;

    @Autowired
    public CommandService(UserService userService, UserMapper userMapper, RoomService roomService, BanService banService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.roomService = roomService;
        this.banService = banService;
    }

    public Message checkMessage(Message message) {
        Pattern checkMessageIsCommand = Pattern.compile("^\\/{1}.{4,}");
        if (checkMessageIsCommand.matcher(message.getMessage()).matches()) {
            if (matchRegex(CommandPattern.TEST.getPattern(), message.getMessage()))
                message = testCmd(message);
            else if (matchRegex(CommandPattern.HELP.getPattern(), message.getMessage()))
                message = helpCmd(message);
            else if (matchRegex(CommandPattern.CLEAR.getPattern(), message.getMessage()))
                message = clearCmd(message);
            else if (matchRegex(CommandPattern.CHANGE_COLOR.getPattern(), message.getMessage()))
                message = changeColorCmd(message);
            else if (matchRegex(CommandPattern.ADD_USER.getPattern(), message.getMessage()))
                message = addUserCmd(message);
            else if (matchRegex(CommandPattern.ALERT.getPattern(), message.getMessage()))
                message = alertCmd(message);
            else if (matchRegex(CommandPattern.ROLE.getPattern(), message.getMessage()))
                message = roleCmd(message);
            else if (matchRegex(CommandPattern.BAN.getPattern(), message.getMessage()))
                message = banCmd(message);
            else if (matchRegex(CommandPattern.LIST_BAN.getPattern(), message.getMessage()))
                message = listBanCmd(message);
            else
                message = error(message, "This command is incorrect");
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
        if (!message.getUser().getRole().equals(Role.ADMIN))
            return error(message, "This command is only for admin");
        String alertMessage = message.getMessage().substring(7);
        message.setMessage(alertMessage);
        message.setType(MessageType.ALERT);
        return message;
    }

    private Message roleCmd(Message message) {
        if (!message.getUser().getRole().equals(Role.ADMIN))
            return error(message, "This command is only for admin");

        String[] splitMessage = message.getMessage().split(" ");
        User user = userService.getUserByLogin(splitMessage[1]);
        switch (Integer.parseInt(splitMessage[2])) {
            case 0:
                user = userService.changeRole(user, Role.USER);
                break;
            case 1:
                user = userService.changeRole(user, Role.ADMIN);
                break;
        }

        message.setType(MessageType.SYSTEM);
        message.setMessage(user.getLogin() + " is now a " + user.getRole());
        return message;
    }

    private Message banCmd(Message message) {
        if (!message.getUser().getRole().equals(Role.ADMIN))
            return error(message, "This command is only for admin");

        String[] splitMessage = message.getMessage().split(" ");
        User user = userService.getUserByLogin(splitMessage[1]);
        Ban ban = banService.addBanForUser(user, Long.parseLong(splitMessage[2]));

        message.setType(MessageType.SYSTEM);
        message.setMessage(user.getLogin() + "  got banned until " + ban.getEnd().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        return message;
    }

    private Message listBanCmd(Message message) {
        List<Ban> banList = banService.getBansByUser(message.getUser().getLogin());
        message.setType(MessageType.SYSTEM);
        if (banList.isEmpty()) {
            message.setMessage("You don't have any bans");
        } else {
            StringBuilder builder = new StringBuilder();
            builder.append("Your bans: <br>");
            banList.stream()
                    .forEach(b -> builder.append(b.getStart().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) +
                            " - " + b.getEnd().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + ", Type: " + b.getType() + "<br>"));
            message.setMessage(builder.toString());
        }
        return message;
    }

    private Message error(Message message, String errorMessage) {
        message.setMessage(errorMessage);
        message.setType(MessageType.ERROR);
        return message;
    }
}
