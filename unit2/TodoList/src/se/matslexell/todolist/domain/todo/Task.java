package se.matslexell.todolist.domain.todo;

import se.matslexell.todolist.domain.property.TaskProperty;
import se.matslexell.todolist.domain.user.Permissions;

import java.util.HashSet;
import java.util.Set;

public class Task {
    private String description;

    private boolean isDone;

    private Set<TaskProperty> taskProperties;

    private Permissions permissions;

    protected Task(String description, Permissions permissions) {
        this.description = description;
        this.isDone = false;
        this.permissions = permissions;
        taskProperties = new HashSet<>();
    }

    public Permissions getPermissions() {
        return permissions;
    }

    public void setPermissions(Permissions permissions) {
        this.permissions = permissions;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void toggleDone() {
        isDone = !isDone;
    }

    public boolean isDone() {
        return isDone;
    }

    protected void removeMe() {
        new HashSet<>(taskProperties).forEach(taskProperty -> taskProperty.removePropertyFrom(this));
    }

    public void addProperty(TaskProperty taskProperty) {
        if (!this.hasProperty(taskProperty)) {
            taskProperties.add(taskProperty);
            taskProperty.addPropertyTo(this);
        }
    }

    public void removeProperty(TaskProperty taskProperty) {
        if (this.hasProperty(taskProperty)) {
            taskProperties.remove(taskProperty);
            taskProperty.removePropertyFrom(this);
        }
    }

    public boolean hasProperty(TaskProperty taskProperty) {
        return taskProperties.contains(taskProperty);
    }

    public Set<TaskProperty> getProperties() {
        return new HashSet<>(taskProperties);
    }
}

