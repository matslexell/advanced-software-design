package se.matslexell.todolist.domain.priority;

import se.matslexell.todolist.domain.listeners.TaskProperty;
import se.matslexell.todolist.domain.todo.Task;

import java.util.*;
import java.util.stream.Collectors;

public class Priorities implements TaskProperty<Priority> {
    private List<Priority> priorities;

    private Map<Task, Priority> taskPriorityMap;

    public Priorities() {
        priorities = new ArrayList<>();
        taskPriorityMap = new HashMap<>();
    }

    public void createNewPriority(String name, String description) {

    }

    public List<Priority> getPriorities() {
        return priorities;
    }

    public void attributePriorityTo(Task task, Priority priority) {
        taskPriorityMap.put(task, priority);
    }

    public Optional<Priority> getPriorityOf(Task task) {
        return Optional.ofNullable(taskPriorityMap.get(task));
    }

    @Override
    public void onRemoveTask(Task task) {
        if (taskPriorityMap.get(task) != null) {
            taskPriorityMap.remove(task);
        }
    }

    @Override
    public void removeProperty(Priority priority) {

        Set<Task> removeTheseTasks = taskPriorityMap.entrySet().stream().filter(
                e -> e.getValue() == priority).map(
                e -> e.getKey()).collect(Collectors.toSet());

        removeTheseTasks.forEach(task -> {
            task.onRemoveProperty(this);
            taskPriorityMap.remove(task);
        });

    }

    @Override
    public void addPropertyTo(Task task) {
        task.onAddProperty(this);
    }
}
