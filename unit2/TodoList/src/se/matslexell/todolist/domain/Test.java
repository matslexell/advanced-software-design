package se.matslexell.todolist.domain;

import se.matslexell.todolist.domain.todo.Task;
import se.matslexell.todolist.domain.todo.TodoList;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Test {

    public Test() {
        Scanner scan = new Scanner(System.in);
        TodoList todoList = new TodoList();
        todoList.createTask("Clean");
        todoList.createTask("Workout");
        todoList.createTask("Eat");


        while (true) {
            List<Task> list = new ArrayList<>(todoList.getTasks());
            printList(list);

            System.out.println("\nWhat do you want to do? (add [text], toggle [idx], remove [idx])");
            String line = scan.nextLine();

            switch(line.split(" ")[0]) {
                case "add":
                    line = line.replaceFirst("add", "").trim();
                    todoList.createTask(line);
                    break;
                case "toggle": {
                    line = line.replaceFirst("toggle", "").trim();
                    Task task = list.get(Integer.parseInt(line));
                    task.toggleDone();
                    break;
                }
                case "remove": {
                    line = line.replaceFirst("remove", "").trim();
                    Task task = list.get(Integer.parseInt(line));
                    todoList.removeTask(task);
                }
            }

        }

    }

    void printList(List<Task> list) {
        int i = 0;
        for (Task task :
                list) {

            System.out.println(i + "\t" + "[" + (task.isDone() ? "X" : " ") +  "] " + task.getDescription() );
            i++;
        }
    }

    public static void main(String[] args) {
        new Test();
    }
}
