package pl.mbalcer.chat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

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
    private Role role;
    private boolean active;

    @ToString.Exclude
    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    private List<Room> rooms;

    public User(String login, String password, String email, String color) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.color = color;
        this.role = Role.USER;
        this.active = false;
    }

    public User(String login, String password, String email, String color, Role role, boolean active) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.color = color;
        this.role = role;
        this.active = active;
    }
}
