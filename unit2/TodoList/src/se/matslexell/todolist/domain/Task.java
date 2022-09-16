package se.matslexell.todolist.domain;

public class Task {
    private String description;

    private boolean isDone;

    public Task(String description) {
        this.description = description;
        this.isDone = false;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean toggleDone() {
        return isDone = !isDone;
    }

    public boolean isDone() {
        return isDone;
    }
}

