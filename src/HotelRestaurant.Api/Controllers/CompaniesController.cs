using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("lookup")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLookup()
        {
            if (User.Identity?.IsAuthenticated == true && !IsSuperAdmin())
            {
                var companyId = GetClaimId("company_id");
                var company = companyId.HasValue ? await _companyService.GetByIdAsync(companyId.Value) : null;
                return Ok(company == null ? Array.Empty<CompanyLookupDto>() : new[]
                {
                    new CompanyLookupDto
                    {
                        Id = company.Id,
                        Name = company.Name,
                        City = company.City,
                        Country = company.Country
                    }
                });
            }

            var result = await _companyService.GetLookupAsync();
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _companyService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            if (!IsSuperAdmin() && GetClaimId("company_id") != id)
            {
                return Forbid();
            }

            var result = await _companyService.GetByIdAsync(id);
            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        private bool IsSuperAdmin() => User.IsInRole("SuperAdmin");

        private int? GetClaimId(string claimType)
        {
            return int.TryParse(User.FindFirst(claimType)?.Value, out var id) ? id : null;
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDto dto)
        {
            var result = await _companyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
    }
}
