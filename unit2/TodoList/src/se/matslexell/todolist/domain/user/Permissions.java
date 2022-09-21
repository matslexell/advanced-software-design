package se.matslexell.todolist.domain.user;

public class Permissions {
    protected User owner;

    private ReadAccess readAccess;

    public Permissions(User owner, ReadAccess readAccess) {
        this.owner = owner;
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

    private static class All extends Access {
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

    public static class ReadAccessAll extends All implements ReadAccess {
    }

    public static class ReadAccessFriends extends Friends implements ReadAccess {
    }

    public static class ReadAccessPrivate extends Private implements ReadAccess {
    }

}

