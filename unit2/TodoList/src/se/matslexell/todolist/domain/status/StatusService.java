package se.matslexell.todolist.domain.status;

import se.matslexell.todolist.domain.todo.Task;
import se.matslexell.todolist.domain.user.User;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static se.matslexell.todolist.domain.property.CollectionOwnership.checkIfPropertyBelongsToCollection;

public class StatusService {
    private Set<Status> statuses;

    private User owner;

    public StatusService(User owner) {
        this.statuses = new HashSet<>();
        setOwner(owner);
    }

    public void setOwner(User owner) {
        this.owner = owner;
        if(owner.getStatusService() != this) {
            owner.setStatusService(this);
        }
    }

    public User getOwner() {
        return owner;
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
