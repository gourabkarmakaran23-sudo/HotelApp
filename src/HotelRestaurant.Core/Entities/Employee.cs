namespace HotelRestaurant.Core.Entities
{
    public class Employee : BaseEntity
    {
        public int HotelId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public EmployeeRole Role { get; set; }
        public DateTime HireDate { get; set; }
        public decimal Salary { get; set; }

        public Hotel? Hotel { get; set; }
    }
}
