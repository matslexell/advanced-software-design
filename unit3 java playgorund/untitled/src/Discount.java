import java.time.DayOfWeek;

public class Discount {
    private final double discountPercent;
    private CustomerTypeDiscount customerTypeDiscount;
    private Item itemDiscount;
    private DayOfWeek dayOfWeekDiscount;

    public Discount(double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public boolean doesDiscountApply(Customer c, Item item) {
        if (customerTypeDiscount != null) {
            return customerTypeDiscount.discountApplies(c);
        }
        if (itemDiscount != null) {
            return itemDiscount == item;
        }
        if (dayOfWeekDiscount != null) {
            return DateUtils.getDayOfWeek().equals(dayOfWeekDiscount);
        }
        return false;
    }

    public double applyDiscount(double price) {
        return price * (1 - discountPercent);
    }

    public abstract class CustomerTypeDiscount {
        public abstract boolean discountApplies(Customer c);
    }

    public class StudentDiscount extends CustomerTypeDiscount {

        @Override
        public boolean discountApplies(Customer c) {
            return c.isStudent();
        }
    }

    public class Employee extends CustomerTypeDiscount {

        @Override
        public boolean discountApplies(Customer c) {
            return c.isEmployee();
        }
    }

    public class Veteran extends CustomerTypeDiscount {

        @Override
        public boolean discountApplies(Customer c) {
            return c.isVeteran();
        }
    }

}
