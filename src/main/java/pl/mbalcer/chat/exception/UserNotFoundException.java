package pl.mbalcer.chat.exception;

public class UserNotFoundException extends RuntimeException {
    private static final String MESSAGE = "Could not find user";

    public UserNotFoundException() {
        super(MESSAGE);
    }
}
