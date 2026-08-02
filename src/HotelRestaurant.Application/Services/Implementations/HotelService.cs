using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class HotelService : IHotelService
    {
        private readonly IUnitOfWork _unitOfWork;

        public HotelService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<HotelLookupDto>> GetLookupAsync()
        {
            var hotels = await _unitOfWork.Hotels.GetAllAsync();
            
            return hotels
                .Where(h => !h.IsDeleted)
                .Select(h => new HotelLookupDto
                {
                    Id = h.Id,
                    Name = h.Name
                });
        }

        public async Task<IEnumerable<HotelDto>> GetAllAsync()
        {
            var hotels = await _unitOfWork.Hotels.GetAllAsync();
            return hotels
                .Where(h => !h.IsDeleted)
                .Select(MapToDto);
        }

        public async Task<HotelDto?> GetByIdAsync(int id)
        {
            var hotel = await _unitOfWork.Hotels.GetByIdAsync(id);
            if (hotel == null || hotel.IsDeleted) return null;
            
            return MapToDto(hotel);
        }

        public async Task<HotelDto> CreateAsync(CreateHotelDto dto)
        {
            var hotel = new HotelRestaurant.Core.Entities.Hotel
            {
                Name = dto.Name,
                Address = dto.Address,
                City = dto.City,
                Country = dto.Country,
                Phone = dto.Phone,
                Email = dto.Email,
                //Rating = dto.Rating
            };

            await _unitOfWork.Hotels.AddAsync(hotel);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(hotel);
        }

        private static HotelDto MapToDto(HotelRestaurant.Core.Entities.Hotel hotel) => new()
        {
            Id = hotel.Id,
            Name = hotel.Name,
            Address = hotel.Address,
            City = hotel.City,
            Country = hotel.Country,
            Phone = hotel.Phone,
            Email = hotel.Email,
            //Rating = hotel.Rating
        };
    }
}