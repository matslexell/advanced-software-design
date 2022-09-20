package se.matslexell.todolist.domain.user;

public class Permissions {
    private User owner;

    private VisibilityType visibilityType;

    private Permissions(Permissions permissions) {
        this.owner = permissions.owner;
        this.visibilityType = permissions.visibilityType;
    }

    private Permissions(User owner, VisibilityType visibilityType) {
        this.owner = owner;
        this.visibilityType = visibilityType;
    }

    public static Permissions create(User owner, VisibilityType visibilityType) {
        return new Permissions(owner, visibilityType);
    }

    public Permissions copy() {
        return new Permissions(this);
    }

    public boolean hasReadRights(User user) {
        if (user == owner) {
            return true;
        }

        switch (visibilityType) {
            case ALL:
                return true;
            case FRIENDS:
                return user.isFriend(owner);
            case PRIVATE:
                return false;
        }

        return false;
    }

    public void setVisibilityType(VisibilityType visibilityType) {
        this.visibilityType = visibilityType;
    }

    public User getOwner() {
        return owner;
    }

    public enum VisibilityType {
        ALL, FRIENDS, PRIVATE
    }
}

