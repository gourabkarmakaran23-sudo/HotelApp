using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Master;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MasterController : ControllerBase
{
    private readonly IMasterService _masterService;

    public MasterController(IMasterService masterService)
    {
        _masterService = masterService;
    }

    #region Currency

    [HttpGet("currencies")]
    public async Task<IActionResult> GetCurrencies()
    {
        return Ok(await _masterService.GetCurrenciesAsync());
    }

    [HttpGet("currencies/{id}")]
    public async Task<IActionResult> GetCurrency(int id)
    {
        var result = await _masterService.GetCurrencyByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("currencies")]
    public async Task<IActionResult> CreateCurrency(
        CurrencyDto dto)
    {
        var id = await _masterService.CreateCurrencyAsync(dto);

        return Ok(id);
    }

    [HttpPut("currencies/{id}")]
    public async Task<IActionResult> UpdateCurrency(
        int id,
        CurrencyDto dto)
    {
        var result = await _masterService.UpdateCurrencyAsync(id, dto);

        if (!result)
            return NotFound();

        return Ok();
    }

    [HttpDelete("currencies/{id}")]
    public async Task<IActionResult> DeleteCurrency(int id)
    {
        var result = await _masterService.DeleteCurrencyAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }

    #endregion

    #region Payment Method

    [HttpGet("payment-methods")]
    public async Task<IActionResult> GetPaymentMethods()
    {
        return Ok(await _masterService.GetPaymentMethodsAsync());
    }

    [HttpGet("payment-methods/{id}")]
    public async Task<IActionResult> GetPaymentMethod(int id)
    {
        var result = await _masterService.GetPaymentMethodByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("payment-methods")]
    public async Task<IActionResult> CreatePaymentMethod(
        PaymentMethodDto dto)
    {
        var id = await _masterService.CreatePaymentMethodAsync(dto);

        return Ok(id);
    }

    [HttpPut("payment-methods/{id}")]
    public async Task<IActionResult> UpdatePaymentMethod(
        int id,
        PaymentMethodDto dto)
    {
        var result = await _masterService.UpdatePaymentMethodAsync(id, dto);

        if (!result)
            return NotFound();

        return Ok();
    }

    [HttpDelete("payment-methods/{id}")]
    public async Task<IActionResult> DeletePaymentMethod(int id)
    {
        var result = await _masterService.DeletePaymentMethodAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }

    #endregion

    #region Commission Agent

    [HttpGet("commission-agents")]
    public async Task<IActionResult> GetCommissionAgents()
    {
        return Ok(await _masterService.GetCommissionAgentsAsync());
    }

    [HttpGet("commission-agents/{id}")]
    public async Task<IActionResult> GetCommissionAgent(int id)
    {
        var result = await _masterService.GetCommissionAgentByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("commission-agents")]
    public async Task<IActionResult> CreateCommissionAgent(
        CommissionAgentDto dto)
    {
        var id = await _masterService.CreateCommissionAgentAsync(dto);

        return Ok(id);
    }

    [HttpPut("commission-agents/{id}")]
    public async Task<IActionResult> UpdateCommissionAgent(
        int id,
        CommissionAgentDto dto)
    {
        var result = await _masterService.UpdateCommissionAgentAsync(id, dto);

        if (!result)
            return NotFound();

        return Ok();
    }

    [HttpDelete("commission-agents/{id}")]
    public async Task<IActionResult> DeleteCommissionAgent(int id)
    {
        var result = await _masterService.DeleteCommissionAgentAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }

    #endregion

    #region Financial Year

    [HttpGet("financial-years")]
    public async Task<IActionResult> GetFinancialYears()
    {
        return Ok(await _masterService.GetFinancialYearsAsync());
    }

    [HttpGet("financial-years/{id}")]
    public async Task<IActionResult> GetFinancialYear(int id)
    {
        var result = await _masterService.GetFinancialYearByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("financial-years")]
    public async Task<IActionResult> CreateFinancialYear(
        FinancialYearDto dto)
    {
        var id = await _masterService.CreateFinancialYearAsync(dto);

        return Ok(id);
    }

    [HttpPut("financial-years/{id}")]
    public async Task<IActionResult> UpdateFinancialYear(
        int id,
        FinancialYearDto dto)
    {
        var result = await _masterService.UpdateFinancialYearAsync(id, dto);

        if (!result)
            return NotFound();

        return Ok();
    }

    [HttpDelete("financial-years/{id}")]
    public async Task<IActionResult> DeleteFinancialYear(int id)
    {
        var result = await _masterService.DeleteFinancialYearAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }

    #endregion

   #region Wake Up Call

    [HttpGet("wake-up-calls")]
    public async Task<IActionResult> GetWakeUpCalls()
    {
        var result = await _masterService.GetWakeUpCallsAsync();
        return Ok(result);
    }

    [HttpGet("wake-up-calls/{id}")]
    public async Task<IActionResult> GetWakeUpCall(int id)
    {
        var result = await _masterService.GetWakeUpCallByIdAsync(id);

        if (result == null)
            return NotFound(new { message = "Record assignment target not located." });

        return Ok(result);
    }

    [HttpPost("wake-up-calls")]
    public async Task<IActionResult> CreateWakeUpCall([FromBody] WakeUpCallDto dto)
    {
        if (!ModelState.IsValid) 
            return BadRequest(ModelState);

        var id = await _masterService.CreateWakeUpCallAsync(dto);
        return Ok(id);
    }

    [HttpPut("wake-up-calls/{id}")]
    public async Task<IActionResult> UpdateWakeUpCall(int id, [FromBody] WakeUpCallDto dto)
    {
        if (!ModelState.IsValid) 
            return BadRequest(ModelState);

        var result = await _masterService.UpdateWakeUpCallAsync(id, dto);

        if (!result)
            return NotFound(new { message = "Record tracking mismatch target identifier error." });

        return Ok(new { success = true });
    }

    [HttpDelete("wake-up-calls/{id}")]
    public async Task<IActionResult> DeleteWakeUpCall(int id)
    {
        var result = await _masterService.DeleteWakeUpCallAsync(id);

        if (!result)
            return NotFound();

        return Ok();
    }

    #endregion
}