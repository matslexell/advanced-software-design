package se.matslexell.todolist.domain.status;

import se.matslexell.todolist.domain.todo.Task;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static se.matslexell.todolist.domain.property.CollectionOwnership.checkIfPropertyBelongsToCollection;

public class StatusService {
    private Set<Status> statuses;

    public StatusService() {
        this.statuses = new HashSet<>();

    }

    public void create(String status) {
        statuses.add(new Status(status));
    }

    public Set<Status> getStatuses() {
        return new HashSet<>(statuses);
    }

    public void addStatus(Task task, Status status) {
        checkIfPropertyBelongsToCollection(statuses, status);
        status.addPropertyTo(task);
    }

    public void removeStatusFrom(Task task, Status status) {
        checkIfPropertyBelongsToCollection(statuses, status);
        status.removePropertyFrom(task);
    }

    public void removeStatus(Status status) {
        checkIfPropertyBelongsToCollection(statuses, status);
        status.removeMe();
        statuses.remove(status);
    }

    public void clearStatus(Task task) {
        new HashSet<>(statuses).forEach(status -> task.removeProperty(status));
    }

    public Set<Status> getStatusesOf(Task task) {
        return statuses.stream().filter(status -> task.hasProperty(status)).collect(Collectors.toSet());
    }

    public boolean hasStatus(Task task, Status status) {
        checkIfPropertyBelongsToCollection(statuses, status);
        return task.hasProperty(status);
    }
}
