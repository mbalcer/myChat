package pl.mbalcer.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    private User user;
    private String room;
    private LocalDateTime dateTime;
    private String message;

}
