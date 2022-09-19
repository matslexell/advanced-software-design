package se.matslexell.todolist.domain.property;

import se.matslexell.todolist.domain.todo.Task;

import java.util.HashSet;
import java.util.Set;

public abstract class TaskProperty {

    private Set<Task> tasks;

    public TaskProperty() {
        this.tasks = new HashSet<>();
    }

    public void removePropertyFrom(Task task) {
        if (this.isPropertyOf(task)) {
            tasks.remove(task);
            task.removeProperty(this);
        }
    }

    public void addPropertyTo(Task task) {
        if (!this.isPropertyOf(task)) {
            tasks.add(task);
            task.addProperty(this);
        }
    }

    public void removeMe() {
        new HashSet<>(tasks).forEach(task -> task.removeProperty(this));
    }

    public boolean isPropertyOf(Task task) {
        return tasks.contains(task);
    }
}
