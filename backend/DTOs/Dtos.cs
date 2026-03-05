namespace PerfectJagah.API.DTOs;

// ── Property ────────────────────────────────────────────────────────────────

public record PropertySummaryDto(
    int Id,
    string Title,
    decimal Price,
    string Location,
    string PropertyType,
    int AreaSqFt,
    DateTime CreatedAt,
    bool IsActive,
    int? PrimaryImageId
);

public record PropertyDetailDto(
    int Id,
    string Title,
    string Description,
    decimal Price,
    string Location,
    string PropertyType,
    int AreaSqFt,
    string? Amenities,
    DateTime CreatedAt,
    bool IsActive,
    List<ImageInfoDto> Images,
    List<DocumentInfoDto> Documents
);

public record ImageInfoDto(int Id, string FileName, string ContentType);

public record DocumentInfoDto(int Id, string FileName, string DisplayName, string ContentType);

public class CreatePropertyDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Location { get; set; } = string.Empty;
    public string PropertyType { get; set; } = string.Empty;
    public int AreaSqFt { get; set; }
    public string? Amenities { get; set; }
}

public class UpdatePropertyDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? Location { get; set; }
    public string? PropertyType { get; set; }
    public int? AreaSqFt { get; set; }
    public string? Amenities { get; set; }
    public bool? IsActive { get; set; }
}

// ── Inquiry ──────────────────────────────────────────────────────────────────

public class CreateInquiryDto
{
    public int PropertyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public record InquiryDto(
    int Id,
    int PropertyId,
    string PropertyTitle,
    string Name,
    string Email,
    string Phone,
    string Message,
    DateTime CreatedAt,
    string Status
);

public class UpdateInquiryDto
{
    public string? Status { get; set; }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public record LoginResponseDto(string Token, string Username, string Role, DateTime ExpiresAt);

// ── Pagination ────────────────────────────────────────────────────────────────

public record PagedResult<T>(List<T> Items, int TotalCount, int Page, int PageSize);

// ── Dashboard ─────────────────────────────────────────────────────────────────

public record DashboardStatsDto(
    int TotalProperties,
    int ActiveProperties,
    int TotalInquiries,
    int NewInquiries,
    List<InquiryDto> RecentInquiries
);
