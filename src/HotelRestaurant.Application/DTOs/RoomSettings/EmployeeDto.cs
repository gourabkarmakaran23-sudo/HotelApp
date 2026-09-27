using System.ComponentModel.DataAnnotations;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.DTOs.RoomSettings
{
    public class EmployeeDto
    {
        public int Id { get; set; }

        [Required, MaxLength(80)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(80)]
        public string LastName { get; set; } = string.Empty;

        [EmailAddress, MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(40)]
        public string Phone { get; set; } = string.Empty;

        public EmployeeRole Role { get; set; }

        public DateTime HireDate { get; set; }

        [Range(0, 999999999)]
        public decimal Salary { get; set; }
    }
}