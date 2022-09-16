package se.matslexell.todolist.domain;

public class Test {
    public static void main(String[] args) {
        TodoList todoList = new TodoList();
        todoList.createTask("Clean");
        todoList.createTask("Workout");
        todoList.createTask("Eat");

        for (Task task :
                todoList.getTasks()) {
            System.out.println(task.getDescription() + " " + task.getId());
        }
    }
}
