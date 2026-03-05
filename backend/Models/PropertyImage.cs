using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PerfectJagah.API.Models;

public class PropertyImage
{
    [Key]
    public int Id { get; set; }

    public int PropertyId { get; set; }

    [Required]
    public byte[] ImageData { get; set; } = Array.Empty<byte>();

    [MaxLength(100)]
    public string ContentType { get; set; } = "image/jpeg";

    [MaxLength(300)]
    public string FileName { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey(nameof(PropertyId))]
    public Property? Property { get; set; }
}
