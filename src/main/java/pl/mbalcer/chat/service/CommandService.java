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
    private Message message;

    @Autowired
    public CommandService(UserService userService, UserMapper userMapper, RoomService roomService, BanService banService) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.roomService = roomService;
        this.banService = banService;
    }

    public Message checkMessage(Message message) {
        this.message = message;
        Pattern checkMessageIsCommand = Pattern.compile("^\\/{1}.{4,}");
        if (checkMessageIsCommand.matcher(message.getMessage()).matches()) {
            if (matchRegex(CommandPattern.TEST.getPattern()))
                testCmd();
            else if (matchRegex(CommandPattern.HELP.getPattern()))
                helpCmd();
            else if (matchRegex(CommandPattern.CLEAR.getPattern()))
                clearCmd();
            else if (matchRegex(CommandPattern.CHANGE_COLOR.getPattern()))
                changeColorCmd();
            else if (matchRegex(CommandPattern.ADD_USER.getPattern()))
                addUserCmd();
            else if (matchRegex(CommandPattern.ALERT.getPattern()))
                alertCmd();
            else if (matchRegex(CommandPattern.ROLE.getPattern()))
                roleCmd();
            else if (matchRegex(CommandPattern.BAN.getPattern()))
                banCmd(BanType.BAN);
            else if (matchRegex(CommandPattern.LIST_BAN.getPattern()))
                listBanCmd();
            else if (matchRegex(CommandPattern.UNBAN.getPattern()))
                unbanCmd();
            else if (matchRegex(CommandPattern.MUTE.getPattern()))
                banCmd(BanType.MUTE);
            else
                error("This command is incorrect");
        } else {
            this.message.setType(MessageType.MESSAGE);
        }
        return this.message;
    }

    private boolean matchRegex(String regex) {
        return Pattern.compile(regex).matcher(message.getMessage()).matches();
    }

    private void testCmd() {
        message.setType(MessageType.SYSTEM);
        message.setMessage("TEST COMMAND");
    }

    private void helpCmd() {
        message.setType(MessageType.HELP);
        message.setMessage("Hi " + message.getUser().getLogin() + ". In this application you can writing with your friends and other people. " +
                "On the left you have a list of room. You can add new room, add users to room and leave from its. " +
                "If you want change color your username or change password you must click on person icon. Thanks for being with us.");
    }

    private void clearCmd() {
        message.setType(MessageType.CLEAR);
        message.setMessage("Messages have been cleared");
    }

    private void changeColorCmd() {
        String color = message.getMessage().split(" ")[1];
        UserDTO user = userMapper.convertToUserDTO(message.getUser());
        user.setColor(color);
        userService.changeColor(user);

        message.setType(MessageType.SYSTEM);
        message.setMessage("The color has been changed correctly");
    }

    private void addUserCmd() {
        if (message.getRoom().equals("All"))
            error("You cannot add people to the room All");
        else {
            String user = message.getMessage().split(" ")[1];
            if (userService.getUserByLogin(user) == null)
                error("No user with nickname: " + user);
            else {
                roomService.addUserToRoom(user, message.getRoom());
                message.setMessage("Added the user " + user + " to room " + message.getRoom());
                message.setType(MessageType.SYSTEM);
            }
        }
    }

    private void alertCmd() {
        if (!checkAdmin())
            error("This command is only for admin");
        else {
            String alertMessage = message.getMessage().substring(7);
            message.setMessage(alertMessage);
            message.setType(MessageType.ALERT);
        }
    }

    private void roleCmd() {
        if (!checkAdmin())
            error("This command is only for admin");
        else {
            String[] splitMessage = message.getMessage().split(" ");
            User user = userService.getUserByLogin(splitMessage[1]);
            switch (Integer.parseInt(splitMessage[2])) {
                case 0: user = userService.changeRole(user, Role.USER); break;
                case 1: user = userService.changeRole(user, Role.ADMIN); break;
            }

            message.setType(MessageType.SYSTEM);
            message.setMessage(user.getLogin() + " is now a " + user.getRole());
        }
    }

    private void banCmd(BanType type) {
        if (!checkAdmin())
            error("This command is only for admin");
        else {
            String[] splitMessage = message.getMessage().split(" ");
            User user = userService.getUserByLogin(splitMessage[1]);
            Ban ban = banService.addBanForUser(user, Long.parseLong(splitMessage[2]), type);

            message.setType(MessageType.SYSTEM);
            message.setMessage(user.getLogin() + "  got " + (type == BanType.BAN ? "banned" : "muted") + " until " + ban.getEnd().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
    }

    private void listBanCmd() {
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
    }

    private void unbanCmd() {
        if (!checkAdmin())
            error("This command is only for admin");
        else {
            User user = userService.getUserByLogin(message.getMessage().split(" ")[1]);
            boolean b = banService.changeEndDate(user);
            if (b) {
                message.setType(MessageType.SYSTEM);
                message.setMessage(user.getLogin() + " is unbanned");
            } else {
                message.setType(MessageType.ERROR);
                message.setMessage("The operation has failed");
            }
        }
    }

    private void error(String errorMessage) {
        message.setMessage(errorMessage);
        message.setType(MessageType.ERROR);
    }

    private boolean checkAdmin() {
        return message.getUser().getRole().equals(Role.ADMIN);
    }
}
