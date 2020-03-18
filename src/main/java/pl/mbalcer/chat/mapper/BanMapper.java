package pl.mbalcer.chat.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.mbalcer.chat.dto.BanDTO;
import pl.mbalcer.chat.model.Ban;

@Component
public class BanMapper {

    @Autowired
    private UserMapper userMapper;

    public BanDTO convertToBanDTO(Ban ban) {
        return new BanDTO(ban.getStart(), ban.getEnd(), ban.getType(), userMapper.convertToUserDTO(ban.getUser()));
    }
}
