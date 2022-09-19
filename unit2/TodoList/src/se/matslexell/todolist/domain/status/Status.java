package se.matslexell.todolist.domain.status;

import se.matslexell.todolist.domain.property.TaskProperty;

public class Status extends TaskProperty {

    private String name;

    protected Status(String name) {
        super();
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
