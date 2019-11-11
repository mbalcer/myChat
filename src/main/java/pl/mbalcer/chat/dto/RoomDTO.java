package pl.mbalcer.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.mbalcer.chat.model.User;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private String name;
    private List<User> users;
}
