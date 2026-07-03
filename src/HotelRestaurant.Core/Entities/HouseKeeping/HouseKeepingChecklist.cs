using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities.HouseKeeping
{
    public class HouseKeepingChecklist
    {
        public int Id { get; set; }
        [Required]
        public string TaskName { get; set; }
        [Required]
        public string Type { get; set; } // House Keeper, Laundry, Room Maintenance
        public bool IsDeleted { get; set; } = false;
    }
}