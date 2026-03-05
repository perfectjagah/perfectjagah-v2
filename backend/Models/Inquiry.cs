using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PerfectJagah.API.Models;

public class Inquiry
{
    [Key]
    public int Id { get; set; }

    public int? PropertyId { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Phone { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // New | Contacted | Closed
    [MaxLength(50)]
    public string Status { get; set; } = "New";

    // Navigation
    [ForeignKey(nameof(PropertyId))]
    public Property? Property { get; set; }
}
