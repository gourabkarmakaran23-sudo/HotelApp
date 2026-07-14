using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelRestaurant.Core.Entities.HouseKeeping
{
    // ১. Room Cleaning Log Entity
   // [Table("roomcleanings")]
   [Table("roomcleanings")]
    public class RoomCleaning
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } // Housekeeper name
        [Required]
        public string RoomNo { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public string Status { get; set; } = "Pending"; // Pending, In Progress, Cleaned
        public bool IsDeleted { get; set; } = false;
    }
}