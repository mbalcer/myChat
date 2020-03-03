package pl.mbalcer.chat.service;

import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.model.MessageType;

import java.util.regex.Pattern;

@Service
public class CommandService {
    private final String PATTERN_TEST_CMD = "^\\/{1}test$";
    private final String PATTERN_HELP_CMD = "^\\/{1}help$";

    public Message checkMessage(Message message) {
        Pattern checkMessageIsCommand = Pattern.compile("^\\/{1}\\D{4,}");
        if (checkMessageIsCommand.matcher(message.getMessage()).matches()) {
            if (matchRegex(PATTERN_TEST_CMD, message.getMessage()))
                message = testCmd(message);
            else if (matchRegex(PATTERN_HELP_CMD, message.getMessage()))
                message = helpCmd(message);
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
}
