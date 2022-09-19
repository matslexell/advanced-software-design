package se.matslexell.todolist.domain.property;

public class WrongTaskPropertyCollection extends RuntimeException {
    public WrongTaskPropertyCollection(TaskProperty taskProperty) {
        super("The TaskProperty=" + taskProperty + ", was passed to a collection it did not belong to.");
    }
}
