namespace HotelRestaurant.Core.Entities
{
    public enum RoomStatus
    {
        Available,
        Reserved,
        Occupied,
        Maintenance,
        OutOfService
    }

    public enum RoomType
    {
        Standard,
        Deluxe,
        Suite,
        Presidential,
        Twin,
        Double
    }

    public enum ReservationStatus
    {
        Pending,
        Confirmed,
        CheckedIn,
        CheckedOut,
        Cancelled,
        NoShow
    }

    public enum OrderStatus
    {
        Pending,
        InPreparation,
        Served,
        Completed,
        Cancelled
    }

    public enum PaymentStatus
    {
        Unpaid,
        Paid,
        PartiallyPaid,
        Refunded
    }

    public enum MenuCategory
    {
        Appetizer,
        MainCourse,
        Dessert,
        Beverage,
        Special
    }

    public enum InventoryUnit
    {
        Piece,
        Kilogram,
        Gram,
        Liter,
        Milliliter,
        Box,
        Pack
    }

    public enum EmployeeRole
    {
        FrontDesk,
        Housekeeping,
        Manager,
        Chef,
        Waiter,
        Bartender,
        Accountant,
        Maintenance
    }
}
