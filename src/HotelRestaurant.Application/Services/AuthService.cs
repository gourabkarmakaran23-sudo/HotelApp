using HotelRestaurant.Core.DTOs.Auth;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services;

/// <summary>
/// Authentication service — orchestrates login and registration workflows.
/// Single Responsibility: authentication use-cases only.
/// DRY: password hashing and token generation delegated to dedicated services.
/// Dependency Inversion: depends on IUnitOfWork and IJwtService abstractions.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public AuthService(IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
            return Fail("Email and password are required.");

        var user = await _unitOfWork.ApplicationUsers.GetByEmailAsync(request.Email.Trim());

        if (user is null || !user.IsActive)
            return Fail("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Fail("Invalid email or password.");

        var token = _jwtService.GenerateToken(user);
        return Success(token, user, "Login successful.");
    }

    // ── Register ──────────────────────────────────────────────────────────────
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email)    ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.FullName))
            return Fail("Full name, email and password are required.");

        if (request.Password != request.ConfirmPassword)
            return Fail("Passwords do not match.");

        if (request.Password.Length < 8)
            return Fail("Password must be at least 8 characters.");

        if (await _unitOfWork.ApplicationUsers.EmailExistsAsync(request.Email.Trim()))
            return Fail("An account with this email already exists.");

        var user = new ApplicationUser
        {
            FullName     = request.FullName.Trim(),
            Email        = request.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role         = request.Role,
            IsActive     = true,
            CreatedAt    = DateTime.UtcNow
        };

        await _unitOfWork.ApplicationUsers.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();  // single transaction commit

        var token = _jwtService.GenerateToken(user);
        return Success(token, user, "Registration successful.");
    }

    // ── Private helpers (DRY) ─────────────────────────────────────────────────
    private static AuthResponseDto Fail(string message)
        => new(Success: false, Message: message);

    private static AuthResponseDto Success(string token, ApplicationUser user, string message)
        => new(
            Success: true,
            Message: message,
            Token:   token,
            UserId:  user.Id,
            FullName: user.FullName,
            Email:   user.Email,
            Role:    user.Role
        );
}