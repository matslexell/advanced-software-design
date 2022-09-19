package se.matslexell.todolist.domain;

import se.matslexell.todolist.domain.priority.Priority;
import se.matslexell.todolist.domain.priority.PriorityService;
import se.matslexell.todolist.domain.status.Status;
import se.matslexell.todolist.domain.status.StatusService;
import se.matslexell.todolist.domain.todo.Task;
import se.matslexell.todolist.domain.todo.TodoList;

import java.util.*;
import java.util.stream.Collectors;

public class Test {

    public Test() {
        Scanner scan = new Scanner(System.in);
        TodoList todoList = new TodoList();
        todoList.createTask("Clean");
        todoList.createTask("Workout");
        todoList.createTask("Eat");

        PriorityService priorities = new PriorityService();
        priorities.createNewPriority("P0", "Most urgent!");
        priorities.createNewPriority("P1", "Very important");
        priorities.createNewPriority("P2", "Do this when you feel like");
        priorities.createNewPriority("P3", "Not so important");

        StatusService statuses = new StatusService();
        statuses.create("blocking");
        statuses.create("booring");
        statuses.create("fun");
        statuses.create("must-do");


        while (true) {
            List<Task> list = new ArrayList<>(todoList.getTasks());
            printTodoList(list, priorities, statuses);

            System.out.println("\nWhat do you want to do? (add [text], toggle [idx], remove [idx], prio, status)");
            String line = scan.nextLine();

            switch (line.split(" ")[0]) {
                case "add":
                    todoList.createTask(text(line, "add"));
                    break;
                case "toggle": {
                    Task task = list.get(firstIndex(line, "toggle"));
                    task.toggleDone();
                    break;
                }
                case "remove": {
                    Task task = list.get(firstIndex(line, "remove"));
                    todoList.removeTask(task);
                }
                break;
                case "prio": {
                    addPrio(scan, priorities, list, statuses);
                }
                break;
                case "status": {
                    status(scan, priorities, list, statuses);
                }
                break;
            }

        }

    }

    public static void main(String[] args) {
        new Test();
    }

    private void status(Scanner scan, PriorityService priorityService, List<Task> initialTaskList,
                        StatusService statusService) {
        List<Task> list = new ArrayList<>(initialTaskList);

        while (true) {
            printTodoList(list, priorityService, statusService);
            ArrayList<Status> statusesList = new ArrayList<>(statusService.getStatuses());
            printStatuses(statusesList);

            System.out.println(
                    "\nWhat do you want to do? (add [task idx] [statusidx], unset [statusidx] [task idx], remove [statusidx], clear [taskidx], filter [statusidx/-1 for all], exit");
            String line = scan.nextLine();

            switch (line.split(" ")[0]) {
                case "add": {
                    statusService.addStatus(list.get(idxS(line, "add")[0]), statusesList.get(idxS(line, "add")[1]));
                }
                break;
                case "unset":
                    statusService.removeStatusFrom(list.get(idxS(line, "unset")[0]),
                            statusesList.get(idxS(line, "unset")[1]));
                    break;
                case "remove":
                    statusService.removeStatus(statusesList.get(idxS(line, "remove")[0]));
                    break;
                case "clear":
                    statusService.clearStatus(list.get(idxS(line, "clear")[0]));
                    break;
                case "filter":
                    if (idxS(line, "filter")[0] == -1) {
                        list = initialTaskList;
                    } else {
                        Status status = statusesList.get(idxS(line, "filter")[0]);
                        list = list.stream().filter(task -> statusService.hasStatus(task, status)).collect(
                                Collectors.toList());
                    }

                    break;
                case "exit":
                    return;
            }


        }
    }

    void addPrio(Scanner scan, PriorityService priorities, List<Task> list, StatusService statuses) {

        list = new ArrayList<>(list);
        while (true) {
            printTodoList(list, priorities, statuses);
            printPriorities(priorities);
            System.out.println(
                    "\nWhat do you want to do? (set [prioLevel] [task idx], unset [task idx], remove [prio level], change [prioLevel, newPrioLevel]), create [name] [the description], sort, exit");
            String line = scan.nextLine();

            switch (line.split(" ")[0]) {
                case "set": {
                    line = text(line, "set");
                    int prioLevel = idxS(line, "set")[0];
                    int taskIdx = idxS(line, "set")[1];

                    priorities.setPriority(list.get(taskIdx), priorities.getPriority(prioLevel));
                }
                break;
                case "unset": {
                    int taskIdx = firstIndex(line, "unset");
                    priorities.unsetPriority(list.get(taskIdx));
                }
                break;
                case "remove": {
                    int prioLevel = firstIndex(line, "remove");
                    priorities.removePriority(priorities.getPriority(prioLevel));
                }
                break;
                case "change": {
                    int prioLevel = idxS(line, "change")[0];
                    int newPrioLevel = idxS(line, "change")[1];

                    priorities.setPriorityLevelOf(priorities.getPriority(prioLevel), newPrioLevel);
                }
                break;
                case "sort":
                    list.sort(priorities.getTaskPriorityComparator());
                    break;
                case "create": {
                    String data[] = text(line, "create").split(" ", 2);
                    priorities.createNewPriority(data[0], data[1]);
                }
                break;
                case "exit":
                    return;
            }
        }
    }

    void printPriorities(PriorityService priorities) {
        int i = 0;
        for (Priority priority :
                priorities.getPriorities()) {
            String basic = i + "\t" + priority.getName() + " - " + priority.getDescription();
            System.out.println(basic);
            i++;
        }
    }

    void printStatuses(ArrayList<Status> statuses) {
        int i = 0;
        for (Status status :
                statuses) {
            String basic = i + "\t" + status.getName();
            System.out.println(basic);
            i++;
        }
    }


    void printTodoList(List<Task> list, PriorityService priorities, StatusService statusService) {
        int i = 0;
        for (Task task :
                list) {
            String basic = i + "\t" + "[" + (task.isDone() ? "X" : " ") + "] " + task.getDescription();

            String prio = priorities.getPriorityOf(task).map(p -> {
                int level = priorities.getPriorityLevelOf(p);
                return "\t(Prio: " + p.getName() + ", level=" + level + ")";
            }).orElse("");

            List<String> statuses = statusService.getStatusesOf(task).stream().map(s -> s.getName()).collect(
                    Collectors.toList());
            String status = statuses.isEmpty() ? "" : "Statuses = [" + String.join(", ", statuses) + "]";
            System.out.println(basic + prio + ",\t\t" + status);
            i++;
        }
    }

    private int firstIndex(String line, String prefix) {
        return idxS(line, prefix)[0];
    }

    private Integer[] idxS(String line, String prefix) {
        line = line.replaceFirst(prefix, "").trim();
        return Arrays.stream(line.split(" ")).map(s -> Integer.parseInt(s)).toArray(Integer[]::new);
    }

    private String text(String line, String prefix) {
        return line.replaceFirst(prefix, "").trim();
    }
}
