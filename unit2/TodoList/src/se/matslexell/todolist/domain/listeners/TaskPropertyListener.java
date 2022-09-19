package se.matslexell.todolist.domain.listeners;

import se.matslexell.todolist.domain.todo.Task;

public interface TaskPropertyListener {

    void onRemoveTask(Task task);

    void addPropertyListener(Task task);

    void removePropertyListener(Task task);

}
