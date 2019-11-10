package pl.mbalcer.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.mbalcer.chat.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
}
