using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PerfectJagah.API.Data;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Helpers;

namespace PerfectJagah.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtHelper _jwt;

    public AuthController(AppDbContext db, JwtHelper jwt)
    {
        _db  = db;
        _jwt = jwt;
    }

    /// <summary>Admin login – returns a JWT.</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.AdminUsers
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid username or password." });

        var (token, expires) = _jwt.GenerateToken(user);

        return Ok(new LoginResponseDto(token, user.Username, user.Role, expires));
    }
}
