package se.matslexell.todolist.domain.priority;

import java.util.HashSet;
import java.util.Set;

public class Priority {
    private String name;
    private String description;

    protected Priority(String name, String description, int prioValue) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
