public class Discount {
    private final double discountPercent;
    private String customerTypeDiscount;
    private String itemNameDiscount;
    private String dayOfWeekDiscount;

    public Discount(double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public boolean doesDiscountApply(Customer c, Item item) {
        if (customerTypeDiscount != null) {
            if (customerTypeDiscount.equals("student")) return c.isStudent();
            else if (customerTypeDiscount.equals("employee")) return c.isEmployee();
        }
        if (itemNameDiscount != null) {
            return item.getName().equals(itemNameDiscount);
        }
        if (dayOfWeekDiscount != null) {
            return DateUtils.getDayOfWeek().equals(dayOfWeekDiscount);
        }
        return false;
    }

    public double applyDiscount(double price) {
        return price * (1 - discountPercent);
    }
}
