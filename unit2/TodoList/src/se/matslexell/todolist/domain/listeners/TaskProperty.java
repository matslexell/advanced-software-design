package se.matslexell.todolist.domain.listeners;

import se.matslexell.todolist.domain.todo.Task;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public interface TaskProperty<Property> {

    void onRemoveTask(Task task);

    void addPropertyTo(Task task);

    void removeProperty(Property property);


}
