using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PerfectJagah.API.Models;

public class Property
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required, MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string PropertyType { get; set; } = string.Empty;

    public int AreaSqFt { get; set; }

    // Stored as comma-separated string
    public string? Amenities { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
    public ICollection<PropertyDocument> Documents { get; set; } = new List<PropertyDocument>();
    public ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();
}
