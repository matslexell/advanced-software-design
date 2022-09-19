package se.matslexell.todolist.domain.priority;

import se.matslexell.todolist.domain.listeners.TaskPropertyListener;
import se.matslexell.todolist.domain.todo.Task;

import java.util.*;

public class Priorities implements TaskPropertyListener {
    private List<Priority> priorities;

    private Map<Task, Priority> taskPriorityMap;

    public Priorities() {
        priorities = new ArrayList<>();
        taskPriorityMap = new HashMap<>();
    }

    public void createNewPriority(String name, String description) {
        priorities.add(new Priority(name, description));
    }

    public boolean setPriorityLevel(Priority priority, int level) {
        if(level < 0 || level >= priorities.size()) {
            return false;
        }
        if(priorities.indexOf(priority) == -1) {
            return false;
        }

        priorities.set(level, priority);
        return true;
    }

    public List<Priority> getPriorities() {
        // Clones a list
        return priorities.stream().toList();
    }

    public void setPriority(Task task, Priority priority) {
        taskPriorityMap.put(task, priority);
        addPropertyListener(task);
    }

    public void unsetPriority(Task task) {
        taskPriorityMap.remove(task);
        removePropertyListener(task);
    }

    public void removePriority(Priority priority) {
        taskPriorityMap.entrySet().stream().filter(
                e -> e.getValue().equals(priority)).map(
                e -> e.getKey()).forEach(task -> {
            removePropertyListener(task);
            taskPriorityMap.remove(task);
        });

        priorities.remove(priority);
    }

    public Optional<Integer> getPriorityLevelOf(Task task) {
        return getPriorityOf(task).flatMap(this::getPriorityLevelOf);
    }

    public Optional<Integer> getPriorityLevelOf(Priority priority) {
        return Optional.of(priorities.indexOf(priority)).filter(level -> level != -1);
    }

    public Optional<Priority> getPriorityOf(Task task) {
        return Optional.ofNullable(taskPriorityMap.get(task));
    }

    public Comparator<Task> getTaskPriorityComparator(){
        return (t1, t2) -> {
            Integer idx1 = getPriorityLevelOf(t1).orElse(priorities.size());
            Integer idx2 = getPriorityLevelOf(t2).orElse(priorities.size());
            return idx1.compareTo(idx2);
        };
    }

    @Override
    public void onRemoveTask(Task task) {
        if (taskPriorityMap.get(task) != null) {
            taskPriorityMap.remove(task);
        }
    }

    @Override
    public void removePropertyListener(Task task) {
        task.onRemovePropertyListener(this);
    }

    @Override
    public void addPropertyListener(Task task) {
        task.onAddPropertyListener(this);
    }
}
