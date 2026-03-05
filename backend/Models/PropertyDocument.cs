using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PerfectJagah.API.Models;

public class PropertyDocument
{
    [Key]
    public int Id { get; set; }

    public int PropertyId { get; set; }

    [Required]
    public byte[] DocumentData { get; set; } = Array.Empty<byte>();

    [MaxLength(100)]
    public string ContentType { get; set; } = "application/pdf";

    [MaxLength(300)]
    public string FileName { get; set; } = string.Empty;

    /// <summary>User-friendly label derived from the file name, e.g. "Brochure", "RERA Certificate".</summary>
    [MaxLength(300)]
    public string DisplayName { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(PropertyId))]
    public Property? Property { get; set; }
}
