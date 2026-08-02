using System.Security.Cryptography;
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

        if (!VerifyPassword(request.Password, user.PasswordHash))
            return Fail("Invalid email or password.");

        if (request.SelectedHotelId.HasValue && request.SelectedHotelId.Value > 0)
        {
            var selectedHotel = await _unitOfWork.Hotels.GetByIdAsync(request.SelectedHotelId.Value);
            if (selectedHotel is null || selectedHotel.IsDeleted)
                return Fail("Selected hotel is invalid.");

            var canViewAllHotels = string.Equals(user.Role, "SuperAdmin", StringComparison.OrdinalIgnoreCase)
                || string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase);

            if (!canViewAllHotels && user.HotelId != request.SelectedHotelId.Value)
            {
                return Fail("This account cannot access the selected hotel.");
            }
        }

        var effectiveHotelId = request.SelectedHotelId.HasValue && request.SelectedHotelId.Value > 0
            ? request.SelectedHotelId.Value
            : (string.Equals(user.Role, "SuperAdmin", StringComparison.OrdinalIgnoreCase)
                || string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase)
                ? (int?)null
                : user.HotelId);

        var token = _jwtService.GenerateToken(user);
        return Success(token, user, "Login successful.", effectiveHotelId);
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

        var normalizedRole = string.IsNullOrWhiteSpace(request.Role)
            ? "User"
            : request.Role.Trim();

        var canViewAllHotels = string.Equals(normalizedRole, "SuperAdmin", StringComparison.OrdinalIgnoreCase)
            || string.Equals(normalizedRole, "Admin", StringComparison.OrdinalIgnoreCase);

        if (!canViewAllHotels && (request.HotelId is null || request.HotelId <= 0))
            return Fail("A valid hotel is required for account registration.");

        if (request.HotelId.HasValue && request.HotelId.Value > 0)
        {
            var existingHotel = await _unitOfWork.Hotels.GetByIdAsync(request.HotelId.Value);
            if (existingHotel is null || existingHotel.IsDeleted)
                return Fail("The selected hotel does not exist.");
        }

        if (await _unitOfWork.ApplicationUsers.EmailExistsAsync(request.Email.Trim()))
            return Fail("An account with this email already exists.");

        var assignedHotelId = request.HotelId.HasValue && request.HotelId.Value > 0
            ? request.HotelId.Value
            : await ResolveDefaultHotelIdAsync();

        if (assignedHotelId <= 0)
            return Fail("No valid hotel is available for account registration.");

        var user = new ApplicationUser
        {
            UserName     = string.IsNullOrWhiteSpace(request.UserName)
                ? request.Email.Trim().Split('@')[0]
                : request.UserName.Trim(),
            FullName     = request.FullName.Trim(),
            Email        = request.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role         = normalizedRole,
            HotelId      = assignedHotelId,
            IsActive     = true,
            CreatedAt    = DateTime.UtcNow
        };

        await _unitOfWork.ApplicationUsers.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);
        return Success(token, user, "Registration successful.", canViewAllHotels ? (int?)null : user.HotelId);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(storedHash))
            return false;

        try
        {
            return BCrypt.Net.BCrypt.Verify(password, storedHash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return VerifyLegacyPasswordHash(password, storedHash);
        }
        catch (ArgumentException)
        {
            return VerifyLegacyPasswordHash(password, storedHash);
        }
    }

    private static bool VerifyLegacyPasswordHash(string password, string storedHash)
    {
        var separator = storedHash.Contains(':') ? ':' : storedHash.Contains('~') ? '~' : default(char?);
        if (separator is null)
            return false;

        var parts = storedHash.Split(separator.Value, 2);
        if (parts.Length != 2)
            return false;

        try
        {
            var salt = Convert.FromBase64String(parts[0]);
            var expectedHash = Convert.FromBase64String(parts[1]);

            using var deriveBytes = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            var computedHash = deriveBytes.GetBytes(32);

            return CryptographicOperations.FixedTimeEquals(expectedHash, computedHash);
        }
        catch
        {
            return false;
        }
    }

    private async Task<int> ResolveDefaultHotelIdAsync()
    {
        var hotels = await _unitOfWork.Hotels.GetAllAsync();
        return hotels.FirstOrDefault(h => !h.IsDeleted)?.Id ?? 0;
    }

    // ── Private helpers (DRY) ─────────────────────────────────────────────────
    private static AuthResponseDto Fail(string message)
        => new(Success: false, Message: message);

    private static AuthResponseDto Success(string token, ApplicationUser user, string message, int? activeHotelId = null)
        => new(
            Success: true,
            Message: message,
            Token:   token,
            UserId:  user.Id,
            FullName: user.FullName,
            Email:   user.Email,
            Role:    user.Role,
            ActiveHotelId: activeHotelId
        );
}