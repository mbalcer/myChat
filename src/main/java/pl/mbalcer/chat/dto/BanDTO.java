package pl.mbalcer.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.mbalcer.chat.model.BanType;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BanDTO {
    private LocalDateTime start;
    private LocalDateTime end;
    private BanType type;
    private UserDTO user;
}
