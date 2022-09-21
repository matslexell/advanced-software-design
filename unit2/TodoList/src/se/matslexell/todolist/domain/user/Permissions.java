package se.matslexell.todolist.domain.user;

/**
 * The Permission object holds info on who gets to read, and in the future, write to certain objects. A permission
 * read/write access can be different for each task, so every task is given a new Permissions instance where access can
 * be set. The hasReadAccess(User) method returns true/false weather this access has been granted by the owner.
 * <p>
 * <br>
 * In action this could be used in the following way: A user wants to see the todo list of some other user, given a
 * username. If this User is found, all todoItems that has been set to read access "Public" will be filtered and
 * returned. If they are all private the todo list will appear empty.
 * <p>
 * <br>
 * Now imagine the same user wants to see the list of another user that, but they have set all tasks with ReadAccess
 * only for friends. The list will appear empty until these users have become friends and are in each others friends
 * lists.
 */
public class Permissions {
    protected User owner;

    private ReadAccess readAccess;

    public Permissions(User owner, ReadAccess readAccess) {
        this.owner = owner;
        this.readAccess = readAccess;
    }

    public void setReadAccess(ReadAccess readAccess) {
        this.readAccess = readAccess;
    }

    public boolean hasReadAccess(User user) {
        return readAccess.hasAccess(user, owner);
    }

    public User getOwner() {
        return owner;
    }

    private interface ReadAccess {
        public boolean hasAccess(User user, User owner);
    }

    private static abstract class Access {
        protected boolean hasAccess(User user, User owner) {
            if (user == owner) {
                return true;
            }

            return false;
        }
    }

    private static class Public extends Access {
        @Override
        public boolean hasAccess(User user, User owner) {
            return true;
        }

    }

    private static class Private extends Access {
        @Override
        public boolean hasAccess(User user, User owner) {
            return super.hasAccess(user, owner);
        }
    }

    private static class Friends extends Access {

        @Override
        public boolean hasAccess(User user, User owner) {
            return super.hasAccess(user, owner) || user.isFriend(owner);
        }
    }

    public static class ReadAccessPublic extends Public implements ReadAccess {
    }

    public static class ReadAccessFriends extends Friends implements ReadAccess {
    }

    public static class ReadAccessPrivate extends Private implements ReadAccess {
    }

}

