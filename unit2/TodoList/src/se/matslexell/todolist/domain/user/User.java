package se.matslexell.todolist.domain.user;

import se.matslexell.todolist.domain.status.StatusService;
import se.matslexell.todolist.domain.todo.TodoList;

import java.util.HashSet;
import java.util.Set;

public class User {
    private TodoList todoList;
    private StatusService statusService;
    private Set<User> friends;
    private String username;
    private Permissions defaultPermissions;

    public User(String username) {
        this.username = username;
        defaultPermissions = Permissions.create(this, Permissions.VisibilityType.ALL);
    }

    public TodoList getTodoList() {
        return todoList;
    }

    public void setTodoList(TodoList todoList) {
        this.todoList = todoList;
        if (todoList.getOwner() != this) {
            todoList.setOwner(this);
        }
    }

    public StatusService getStatusService() {
        return statusService;
    }

    public void setStatusService(StatusService statusService) {
        this.statusService = statusService;
        if (statusService.getOwner() != this) {
            statusService.setOwner(this);
        }
    }

    public Set<User> getFriends() {
        return new HashSet<>(friends);
    }

    public void addFriend(User user) {
        if (!isFriend(user)) {
            this.friends.add(user);
            user.addFriend(this);
        }
    }

    public void removeFriend(User user) { // :'(
        if (isFriend(user)) {
            this.friends.remove(user);
            user.removeFriend(this);
        }
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Permissions getDefaultPermissions() {
        return defaultPermissions.copy();
    }

    public boolean isFriend(User user) {
        return friends.contains(user);
    }
}
