package pl.mbalcer.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.mbalcer.chat.dto.UserDTO;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    private UserDTO user;
    private String room;
    private LocalDateTime dateTime;
    private MessageType type;
    private String message;

}
