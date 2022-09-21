package se.matslexell.todolist.domain.priority;

import se.matslexell.todolist.domain.todo.Task;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static se.matslexell.todolist.domain.property.CollectionOwnership.checkIfPropertyBelongsToCollection;

public class PriorityService {
    private List<Priority> priorities;

    public PriorityService() {
        priorities = new ArrayList<>();


    }

    public void createNewPriority(String name, String description) {
        priorities.add(new Priority(name, description));
    }

    public boolean setPriorityLevelOf(Priority priority, int level) {
        checkIfPropertyBelongsToCollection(priorities, priority);

        if (level < 0 || level >= priorities.size()) {
            return false;
        }
        int idx = priorities.indexOf(priority);
        if (idx == -1) {
            return false;
        }

        priorities.remove(idx);
        priorities.add(level, priority);
        return true;
    }

    public List<Priority> getPriorities() {
        // Clones a list
        return new ArrayList<>(priorities);
    }

    public Priority getPriority(int level) {
        return priorities.get(level);
    }

    public void setPriority(Task task, Priority priority) {
        checkIfPropertyBelongsToCollection(priorities, priority);
        priority.addPropertyTo(task);
    }

    public void unsetPriority(Task task) {
        getPriorityOf(task).ifPresent(priority -> priority.removePropertyFrom(task));
    }

    public void removePriority(Priority priority) {
        checkIfPropertyBelongsToCollection(priorities, priority);
        priority.removeMe();
        priorities.remove(priority);
    }

    public Optional<Integer> getPriorityLevelOf(Task task) {
        return getPriorityOf(task).map(this::getPriorityLevelOf);
    }

    public int getPriorityLevelOf(Priority priority) {
        checkIfPropertyBelongsToCollection(priorities, priority);
        return priorities.indexOf(priority);
    }

    public Optional<Priority> getPriorityOf(Task task) {
        return priorities.stream().filter(p -> task.hasProperty(p)).findFirst();
    }

    public Comparator<Task> getTaskPriorityComparator() {
        return (t1, t2) -> {
            Integer idx1 = getPriorityLevelOf(t1).orElse(priorities.size());
            Integer idx2 = getPriorityLevelOf(t2).orElse(priorities.size());
            return idx1.compareTo(idx2);
        };
    }
}
