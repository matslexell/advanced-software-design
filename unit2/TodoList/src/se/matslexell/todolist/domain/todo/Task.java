package se.matslexell.todolist.domain.todo;

import se.matslexell.todolist.domain.listeners.TaskPropertyListener;

import java.util.HashSet;
import java.util.Set;

public class Task {
    private String description;

    private boolean isDone;

    private Set<TaskPropertyListener> taskPropertyListeners;

    protected Task(String description) {
        this.description = description;
        this.isDone = false;
        taskPropertyListeners = new HashSet<>();
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

    protected void removeMe() {
        taskPropertyListeners.forEach(taskProperty -> taskProperty.onRemoveTask(this));
    }

    public void onAddPropertyListener(TaskPropertyListener taskPropertyListener) {
        taskPropertyListeners.add(taskPropertyListener);
    }

    public void onRemovePropertyListener(TaskPropertyListener taskProperty) {
        taskPropertyListeners.remove(taskProperty);
    }
}

