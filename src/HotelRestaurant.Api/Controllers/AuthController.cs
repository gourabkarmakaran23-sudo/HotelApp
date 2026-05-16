using HotelRestaurant.Core.DTOs.Auth;
using HotelRestaurant.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers;

/// <summary>
/// Auth endpoints — Login and Register.
/// Single Responsibility: HTTP concerns only; delegates logic to IAuthService.
/// Thin controller — no business logic lives here.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger      = logger;
    }

    /// <summary>Authenticate user and return JWT token.</summary>
    /// <response code="200">Login successful — returns token and user info.</response>
    /// <response code="401">Invalid credentials.</response>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        _logger.LogInformation("Login attempt for {Email}", request.Email);

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            _logger.LogWarning("Failed login for {Email}", request.Email);
            return Unauthorized(result);
        }

        _logger.LogInformation("Successful login for {Email}", request.Email);
        return Ok(result);
    }

    /// <summary>Register a new user account.</summary>
    /// <response code="201">Registration successful — returns token and user info.</response>
    /// <response code="400">Validation failed or email already in use.</response>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        _logger.LogInformation("Registration attempt for {Email}", request.Email);

        var result = await _authService.RegisterAsync(request);

        if (!result.Success)
        {
            _logger.LogWarning("Registration failed for {Email}: {Message}",
                               request.Email, result.Message);
            return BadRequest(result);
        }

        _logger.LogInformation("User registered: {Email}", request.Email);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    /// <summary>Returns the current authenticated user's profile (requires JWT).</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me()
    {
        var userId   = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email    = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var fullName = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        var role     = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        return Ok(new { userId, email, fullName, role });
    }
}