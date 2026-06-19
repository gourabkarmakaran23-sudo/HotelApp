using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Account;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("opening-balances")]
        public async Task<IActionResult> GetOpeningBalances()
        {
            return Ok(await _accountService.GetOpeningBalancesAsync());
        }

        [HttpGet("opening-balances/{id}")]
        public async Task<IActionResult> GetOpeningBalance(int id)
        {
            var result = await _accountService.GetOpeningBalanceByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost("opening-balances")]
        public async Task<IActionResult> CreateOpeningBalance([FromBody] OpeningBalanceDto dto)
        {
            var id = await _accountService.CreateOpeningBalanceAsync(dto);
            return Ok(id);
        }

        [HttpPut("opening-balances/{id}")]
        public async Task<IActionResult> UpdateOpeningBalance(int id, [FromBody] OpeningBalanceDto dto)
        {
            var success = await _accountService.UpdateOpeningBalanceAsync(id, dto);
            if (!success) return NotFound();
            return Ok(success);
        }

        [HttpDelete("opening-balances/{id}")]
        public async Task<IActionResult> DeleteOpeningBalance(int id)
        {
            var success = await _accountService.DeleteOpeningBalanceAsync(id);
            if (!success) return NotFound();
            return Ok(success);
        }
    }
}