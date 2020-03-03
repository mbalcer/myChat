package pl.mbalcer.chat.service;

import org.springframework.stereotype.Service;
import pl.mbalcer.chat.model.Message;
import pl.mbalcer.chat.model.MessageType;

import java.util.regex.Pattern;

@Service
public class CommandService {
    private final String PATTERN_TEST_CMD = "^\\/{1}test$";

    public Message checkMessage(Message message) {
        Pattern checkMessageIsCommand = Pattern.compile("^\\/{1}\\D{4,}");
        if (checkMessageIsCommand.matcher(message.getMessage()).matches()) {
            if (Pattern.compile(PATTERN_TEST_CMD).matcher(message.getMessage()).matches())
                message = testCmd(message);
        } else {
            message.setType(MessageType.MESSAGE);
        }
        return message;
    }

    private Message testCmd(Message message) {
        message.setType(MessageType.SYSTEM);
        message.setMessage("TEST COMMAND");
        return message;
    }
}
