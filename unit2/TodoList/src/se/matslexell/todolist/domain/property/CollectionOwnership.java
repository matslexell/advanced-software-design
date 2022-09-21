package se.matslexell.todolist.domain.property;

import java.util.Collection;

public class CollectionOwnership {
    public static void checkIfPropertyBelongsToCollection(Collection<? extends TaskProperty> taskProperties,
                                                          TaskProperty taskProperty) {
        if (!taskProperties.contains(taskProperty)) {
            throw new WrongTaskPropertyCollection(taskProperty);
        }
    }
}
