using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class CompanyService : ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CompanyService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CompanyLookupDto>> GetLookupAsync()
        {
            var companies = await _unitOfWork.Companies.GetAllAsync();
            return companies
                .Where(c => !c.IsDeleted)
                .Select(MapToLookupDto)
                .ToList();
        }

        public async Task<IEnumerable<CompanyDto>> GetAllAsync()
        {
            var companies = await _unitOfWork.Companies.GetAllAsync();
            return companies
                .Where(c => !c.IsDeleted)
                .Select(MapToDto)
                .ToList();
        }

        public async Task<CompanyDto?> GetByIdAsync(int id)
        {
            var company = await _unitOfWork.Companies.GetByIdAsync(id);
            if (company == null || company.IsDeleted)
            {
                return null;
            }

            return MapToDto(company);
        }

        public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new InvalidOperationException("Company name is required.");
            }

            var company = new Company
            {
                Name = dto.Name.Trim(),
                LegalRegistrationNumber = dto.LegalRegistrationNumber.Trim(),
                Address = dto.Address.Trim(),
                City = dto.City.Trim(),
                Country = dto.Country.Trim(),
                Phone = dto.Phone.Trim(),
                Email = dto.Email.Trim(),
                IsActive = dto.IsActive
            };

            await _unitOfWork.Companies.AddAsync(company);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(company);
        }

        private static CompanyLookupDto MapToLookupDto(Company company) => new()
        {
            Id = company.Id,
            Name = company.Name,
            City = company.City,
            Country = company.Country
        };

        private static CompanyDto MapToDto(Company company) => new()
        {
            Id = company.Id,
            Name = company.Name,
            LegalRegistrationNumber = company.LegalRegistrationNumber,
            Address = company.Address,
            City = company.City,
            Country = company.Country,
            Phone = company.Phone,
            Email = company.Email,
            IsActive = company.IsActive
        };
    }
}
