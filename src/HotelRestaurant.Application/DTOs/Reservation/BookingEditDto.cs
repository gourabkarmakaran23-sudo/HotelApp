using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Reservation
{
    public class BookingEditDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int ReservationRoomId { get; set; }
        public string BookingNumber { get; set; } = string.Empty;
        public DateTime CheckIn { get; set; }

        public DateTime CheckOut { get; set; }

        public decimal TotalAmount { get; set; }

        // Reservation Details
        public string BookingType { get; set; } = "";
        public string BookingReference { get; set; } = "";
        public string SoldBy { get; set; } = "";
        public string ArrivalFrom { get; set; } = "";
        public string CustomerProfile { get; set; } = "";
        public string PurposeOfVisit { get; set; } = "";
        public string Remarks { get; set; } = "";
        // Customer Info
        public string BillingFirstName { get; set; } = "";
        public string BillingLastName { get; set; } = "";
        public string BillingMobile { get; set; } = "";
        public string BillingAddress { get; set; } = "";
        public string Email { get; set; } = "";
        public string Gstin { get; set; } = "";
        public string Title { get; set; } = "";
        //public string BillingTitle { get; set; } = string.Empty;


        // Primary Guest Info
        public string GuestTitle { get; set; } = "";
        public string GuestFirstName { get; set; } = "";
        public string GuestLastName { get; set; } = "";
        public string GuestMobile { get; set; } = "";
        public string Nationality { get; set; } = "";


        // Billing
        public decimal BookingCharge { get; set; }
        public decimal GstAmount { get; set; }
        public decimal GrandTotal { get; set; }
        public string PaymentMode { get; set; } = "";
        public decimal AdvanceAmount { get; set; }
        public string AdvanceRemarks { get; set; } = "";
        public bool SameAsCustomer { get; set; }
        public string PrimaryTitle { get; set; } = string.Empty;
        public string PrimaryFirstName { get; set; } = string.Empty;
        public string PrimaryLastName { get; set; } = string.Empty;
        public string PrimaryMobile { get; set; } = string.Empty;
        public decimal BalanceDue { get; set; }


        public List<BookingRoomEditDto> Rooms { get; set; } = new();

        // ADD THIS PROPERTY:
        public List<BookingGuestEditDto> BookingGuests { get; set; } = new();

    }
    // public class BookingEditDto
    // {
    //     public int Id { get; set; }
    //      public int BookingId { get; set; }
    //       public string BookingNumber { get; set; } = string.Empty;

    //     public string BookingType { get; set; }

    //     public string BookingReference { get; set; }

    //     public string SoldBy { get; set; }

    //     public string ArrivalFrom { get; set; }

    //     public string CustomerProfile { get; set; }

    //     public string PurposeOfVisit { get; set; }

    //     public string Remarks { get; set; }

    //     public DateTime CheckIn { get; set; }

    //     public DateTime CheckOut { get; set; }

    //     public decimal TotalAmount { get; set; }

    //     public string BillingTitle { get; set; }

    //     public string BillingFirstName { get; set; }

    //     public string BillingLastName { get; set; }

    //     public string BillingMobile { get; set; }

    //     public string BillingAddress { get; set; }

    //     public string Email { get; set; }

    //     public string Gstin { get; set; }

    //     public string PaymentMode { get; set; }

    //     public decimal AdvanceAmount { get; set; }

    //     public string AdvanceRemarks { get; set; }

    //     public bool SameAsCustomer { get; set; }

    //     public string PrimaryTitle { get; set; }

    //     public string PrimaryFirstName { get; set; }

    //     public string PrimaryLastName { get; set; }

    //     public string PrimaryMobile { get; set; }

    //     public string Nationality { get; set; }

    //     // public List<RoomBookingDto> Rooms { get; set; }
    //      public List<BookingRoomEditDto> Rooms { get; set; }
    // //         = new();
    // }
    // public class BookingRoomEditDto
    // {
    //     public int ReservationRoomId { get; set; }

    //     public int RoomId { get; set; }

    //     public int RoomTypeId { get; set; }

    //     public string RoomNo { get; set; } = string.Empty;

    //     public string MealPlan { get; set; } = string.Empty;

    //     public int Adults { get; set; }

    //     public int Children { get; set; }

    //     public int ExtraChildAge { get; set; }

    //     public decimal RentPerNight { get; set; }

    //     public decimal ComplimentaryPerNight { get; set; }

    //     public decimal ExtraCharge { get; set; }

    //     public decimal TotalAmount { get; set; }
    // }

    public class BookingRoomEditDto
    {
        public int RoomId { get; set; }

        public int RoomTypeId { get; set; }
        public int ReservationRoomId { get; set; }

        public string RoomNo { get; set; } = string.Empty;

        public string MealPlan { get; set; } = string.Empty;

        public int Adults { get; set; }

        public int Children { get; set; }
        public string ChildAge { get; set; } = "";
        public decimal RentPerNight { get; set; }

        public decimal ComplimentaryNight { get; set; }


        public decimal ExtraChildCharge { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal BalanceDue { get; set; }
    }



    public class BookingGuestEditDto
    {
        public string RoomNo { get; set; } = "";
        public string Title { get; set; } = "Mr.";
        public string GuestFirstName { get; set; } = "";
        public string GuestLastName { get; set; } = "";
        public string Mobile { get; set; } = "";
        public string Gender { get; set; } = "Male";
        public int? Age { get; set; }
        public string IdType { get; set; } = "Aadhar Card";
        public string IdNumber { get; set; } = "";
    }
}