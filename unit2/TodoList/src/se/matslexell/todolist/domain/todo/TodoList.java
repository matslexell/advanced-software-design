package se.matslexell.todolist.domain.todo;

import se.matslexell.todolist.domain.todo.Task;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class TodoList {
    private Set<Task> tasks;

    public TodoList() {
        this.tasks = new HashSet<>();
    }

    public void createTask(String description) {
        tasks.add(new Task(description));
    }

    public void removeTask(Task task) {
        tasks.remove(task);
        task.removeMe();
    }

    public Set<Task> getTasks() {
        // Clone the set
        return tasks.stream().collect(Collectors.toSet());
    }
}
