using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Master;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtendedMasterController : ControllerBase
    {
        private readonly IMasterServiceExtension _service;

        public ExtendedMasterController(IMasterServiceExtension service)
        {
            _service = service;
        }

        // --- TAX ENDPOINTS ---
        [HttpGet("taxes")] public async Task<IActionResult> GetTaxes() => Ok(await _service.GetTaxesAsync());
        [HttpPost("taxes")] public async Task<IActionResult> CreateTax([FromBody] TaxDto d) => Ok(await _service.CreateTaxAsync(d));
        [HttpPut("taxes/{id}")] public async Task<IActionResult> UpdateTax(int id, [FromBody] TaxDto d) => Ok(await _service.UpdateTaxAsync(id, d));
        [HttpDelete("taxes/{id}")] public async Task<IActionResult> DeleteTax(int id) => Ok(await _service.DeleteTaxAsync(id));

        // --- PROMOCODE ENDPOINTS ---
        [HttpGet("promocodes")] public async Task<IActionResult> GetPromocodes() => Ok(await _service.GetPromocodesAsync());
        [HttpPost("promocodes")] public async Task<IActionResult> CreatePromocode([FromBody] PromocodeDto d) => Ok(await _service.CreatePromocodeAsync(d));
        [HttpPut("promocodes/{id}")] public async Task<IActionResult> UpdatePromocode(int id, [FromBody] PromocodeDto d) => Ok(await _service.UpdatePromocodeAsync(id, d));
        [HttpDelete("promocodes/{id}")] public async Task<IActionResult> DeletePromocode(int id) => Ok(await _service.DeletePromocodeAsync(id));

        // --- CANCELLATION POLICY ENDPOINTS ---
        [HttpGet("cancellation-policies")] public async Task<IActionResult> GetPolicies() => Ok(await _service.GetCancellationPoliciesAsync());
        [HttpPost("cancellation-policies")] public async Task<IActionResult> CreatePolicy([FromBody] CancellationPolicyDto d) => Ok(await _service.CreateCancellationPolicyAsync(d));
        [HttpPut("cancellation-policies/{id}")] public async Task<IActionResult> UpdatePolicy(int id, [FromBody] CancellationPolicyDto d) => Ok(await _service.UpdateCancellationPolicyAsync(id, d));
        [HttpDelete("cancellation-policies/{id}")] public async Task<IActionResult> DeletePolicy(int id) => Ok(await _service.DeleteCancellationPolicyAsync(id));

        // --- AMENITIES ENDPOINTS ---
        [HttpGet("amenities")] public async Task<IActionResult> GetAmenities() => Ok(await _service.GetAmenitiesAsync());
        [HttpPost("amenities")] public async Task<IActionResult> CreateAmenity([FromBody] AmenityDto d) => Ok(await _service.CreateAmenityAsync(d));
        [HttpPut("amenities/{id}")] public async Task<IActionResult> UpdateAmenity(int id, [FromBody] AmenityDto d) => Ok(await _service.UpdateAmenityAsync(id, d));
        [HttpDelete("amenities/{id}")] public async Task<IActionResult> DeleteAmenity(int id) => Ok(await _service.DeleteAmenityAsync(id));
    }
}