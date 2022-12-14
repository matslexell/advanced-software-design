package se.matslexell.todolist.domain.todo;

import se.matslexell.todolist.domain.user.User;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class TodoList {
    private Set<Task> tasks;

    private User owner;

    public TodoList(User owner) {
        this.tasks = new HashSet<>();
        setOwner(owner);
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
        if (owner.getTodoList() != this) {
            owner.setTodoList(this);
        }
    }

    public void createTask(String description) {
        tasks.add(new Task(description, owner.getDefaultPermissions()));
    }

    public void removeTask(Task task) {
        if (tasks.contains(task)) {
            tasks.remove(task);
            task.removeMe();
        }
    }

    public Set<Task> getTasks(User user) {
        /**
         * This filtering might make more sense doing downstream since different filtering might be applied depending
         * on future feature set is used. But this is applied here for now...
         */
        return tasks.stream().filter(task -> task.getPermissions().hasReadAccess(user)).collect(
                Collectors.toSet());


    }
}
