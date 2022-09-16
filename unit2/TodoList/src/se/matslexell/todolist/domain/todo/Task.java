package se.matslexell.todolist.domain.todo;

import se.matslexell.todolist.domain.listeners.TaskProperty;

import java.util.HashSet;
import java.util.Set;

public class Task {
    private String description;

    private boolean isDone;

    private Set<TaskProperty> taskProperties;

    protected Task(String description) {
        this.description = description;
        this.isDone = false;
        taskProperties = new HashSet<>();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean toggleDone() {
        return isDone = !isDone;
    }

    public boolean isDone() {
        return isDone;
    }

    public void removeMe() {
        taskProperties.forEach(taskProperty -> taskProperty.onRemoveTask(this));
    }

    public void onAddProperty(TaskProperty taskProperty) {
        taskProperties.add(taskProperty);
    }

    public void onRemoveProperty(TaskProperty taskProperty) {
        taskProperties.remove(taskProperty);
    }
}

