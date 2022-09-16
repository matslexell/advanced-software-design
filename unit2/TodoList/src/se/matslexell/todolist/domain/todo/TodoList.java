package se.matslexell.todolist.domain.todo;

import se.matslexell.todolist.domain.todo.Task;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class TodoList {
    private Set<Task> tasks;

    TodoList() {
        this.tasks = new HashSet<>();
    }

    void createTask(String description) {
        tasks.add(new Task(description));
    }

    void removeTask(Task task) {
        tasks.remove(task);
    }

    public Set<Task> getTasks() {
        // Clone the set
        return tasks.stream().collect(Collectors.toSet());
    }
}
