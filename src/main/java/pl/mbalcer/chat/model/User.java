package pl.mbalcer.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String login;
    private String password;
    private String email;
    private String color;

    @ManyToMany(mappedBy = "users")
    private List<Room> rooms;

    public User(String login, String password, String email, String color) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.color = color;
    }
}
