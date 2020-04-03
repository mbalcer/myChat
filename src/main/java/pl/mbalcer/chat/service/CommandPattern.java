package pl.mbalcer.chat.service;

public enum CommandPattern {
    TEST("^\\/{1}test$"),
    HELP("^\\/{1}help$"),
    CLEAR("^\\/{1}clear$"),
    CHANGE_COLOR("^\\/{1}color\\s{1}#[0-9a-fA-F]{6}$"),
    ADD_USER("^\\/{1}add\\s{1}\\w{4,}$"),
    ALERT("^\\/{1}alert\\s{1}.{4,}$"),
    ROLE("^\\/{1}role\\s{1}\\w{4,}\\s{1}[0-1]{1}$"),
    BAN("^\\/{1}ban\\s{1}\\w{4,}\\s{1}\\d{1,3}$"),
    LIST_BAN("^\\/{1}bans$"),
    UNBAN("^\\/{1}unban\\s{1}\\w{4,}$"),
    MUTE("^\\/{1}mute\\s{1}\\w{4,}\\s{1}\\d{1,3}$");

    private String pattern;

    CommandPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getPattern() {
        return pattern;
    }
}
