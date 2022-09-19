package se.matslexell.todolist.domain.priority;

import se.matslexell.todolist.domain.property.TaskProperty;
import se.matslexell.todolist.domain.todo.Task;

public class Priority extends TaskProperty {
    private String name;
    private String description;

    protected Priority(String name, String description) {
        super();
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public void addPropertyTo(Task task) {
        if (!this.isPropertyOf(task)) {
            task.getProperties().stream().filter(taskProperty -> taskProperty instanceof Priority).forEach(
                    priority -> priority.removePropertyFrom(task));
            super.addPropertyTo(task);
        }
    }
}
