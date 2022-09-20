package se.matslexell.todolist.domain.property;

import java.util.Collection;

public class CollectionOwnership {
    public static <Data> void checkIfPropertyBelongsToCollection(Collection<Data> taskProperties,
                                                          TaskProperty taskProperty) {
        if (!taskProperties.contains(taskProperty)) {
            throw new WrongTaskPropertyCollection(taskProperty);
        }
    }
}
