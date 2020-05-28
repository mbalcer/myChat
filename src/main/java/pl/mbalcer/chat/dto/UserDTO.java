package pl.mbalcer.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.mbalcer.chat.model.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String login;
    private String email;
    private String color;
    private Role role;
    private boolean active;
}
