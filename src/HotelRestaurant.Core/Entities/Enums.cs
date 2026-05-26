namespace HotelRestaurant.Core.Entities
{
    public enum RoomStatus
    {
        // Available,
        // Reserved,
        // Occupied,
        // Maintenance,

        // Available = 0,
        // Occupied = 1,
        // Maintenance = 2,
        // OutOfService = 3,
        // Cleaning = 4,
        // Reserved = 5

        Available = 1,
    Occupied = 2,
    Maintenance = 3,
    Reserved = 4,
    OutOfService = 5,
    Cleaning = 6
    }

    // public enum RoomType
    // {
    //     Standard,
    //     Deluxe,
    //     Suite,
    //     Presidential,
    //     Twin,
    //     Double
    // }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        CheckedIn,
        CheckedOut,
        Cancelled,
        NoShow
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

    public enum PaymentMethod
    {
        Cash,
        CreditCard,
        DebitCard,
        MobilePayment,
        BankTransfer,
        Voucher
    }

    public enum SeasonType
    {
        Regular,
        Peak,
        OffPeak
    }
}
