using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs;namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IHotelService
    {
        Task<IEnumerable<HotelLookupDto>> GetLookupAsync();
        Task<IEnumerable<HotelDto>> GetAllAsync();
        Task<HotelDto?> GetByIdAsync(int id);
        Task<HotelDto> CreateAsync(CreateHotelDto dto);
    }
}