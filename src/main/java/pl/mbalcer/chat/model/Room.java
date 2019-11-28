package pl.mbalcer.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToMany
    @JoinTable(
            name = "user_in_rooms",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> users;

    public Room(String name) {
        this.name = name;
    }

    public void addUser(User user) {
        this.users.add(user);
        user.getRooms().add(this);
    }

    public void removeUser(User user) {
        this.users.remove(user);
        user.getRooms().remove(this);
    }
}
