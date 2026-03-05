using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/properties")]
public class AdminPropertiesController : ControllerBase
{
    private readonly IPropertyRepository _props;
    private readonly IImageRepository    _images;

    public AdminPropertiesController(IPropertyRepository props, IImageRepository images)
    {
        _props  = props;
        _images = images;
    }

    /// <summary>List all properties (including inactive) with pagination.</summary>
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string? location,
        [FromQuery] string? type,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? sort = "newest",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        pageSize = Math.Clamp(pageSize, 1, 100);
        page     = Math.Max(page, 1);

        var result = await _props.GetPagedAsync(
            location, type, minPrice, maxPrice, null, null,
            sort, page, pageSize, includeInactive: true);

        return Ok(result);
    }

    /// <summary>Get full property detail (admin view).</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Detail(int id)
    {
        var dto = await _props.GetDetailAsync(id, includeInactive: true);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    /// <summary>Create a new property. Images are uploaded as multipart files.</summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreatePropertyDto dto,
                                             [FromForm] List<IFormFile>? images)
    {
        var property = new Property
        {
            Title        = dto.Title,
            Description  = dto.Description,
            Price        = dto.Price,
            Location     = dto.Location,
            PropertyType = dto.PropertyType,
            AreaSqFt     = dto.AreaSqFt,
            Amenities    = dto.Amenities
        };

        var created = await _props.CreateAsync(property);

        if (images is { Count: > 0 })
            await SaveImagesAsync(created.Id, images);

        var detail = await _props.GetDetailAsync(created.Id, includeInactive: true);
        return CreatedAtAction(nameof(Detail), new { id = created.Id }, detail);
    }

    /// <summary>Update property fields. Attach new images via files; delete specific images via deleteImageIds.</summary>
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(int id,
                                             [FromForm] UpdatePropertyDto dto,
                                             [FromForm] List<IFormFile>? images,
                                             [FromForm] List<int>? deleteImageIds)
    {
        var entity = await _props.GetEntityAsync(id);
        if (entity is null) return NotFound();

        if (dto.Title        is not null) entity.Title        = dto.Title;
        if (dto.Description  is not null) entity.Description  = dto.Description;
        if (dto.Price        is not null) entity.Price        = dto.Price.Value;
        if (dto.Location     is not null) entity.Location     = dto.Location;
        if (dto.PropertyType is not null) entity.PropertyType = dto.PropertyType;
        if (dto.AreaSqFt     is not null) entity.AreaSqFt     = dto.AreaSqFt.Value;
        if (dto.Amenities    is not null) entity.Amenities    = dto.Amenities;
        if (dto.IsActive     is not null) entity.IsActive     = dto.IsActive.Value;

        await _props.UpdateAsync(entity);

        if (deleteImageIds is { Count: > 0 })
            foreach (var imgId in deleteImageIds)
                await _images.DeleteAsync(imgId);

        if (images is { Count: > 0 })
            await SaveImagesAsync(id, images);

        return NoContent();
    }

    /// <summary>Soft-delete a property.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _props.SoftDeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private async Task SaveImagesAsync(int propertyId, List<IFormFile> files)
    {
        const long maxSize = 10 * 1024 * 1024; // 10 MB per image

        foreach (var file in files)
        {
            if (file.Length == 0 || file.Length > maxSize) continue;

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);

            await _images.AddAsync(new PropertyImage
            {
                PropertyId  = propertyId,
                ImageData   = ms.ToArray(),
                ContentType = file.ContentType,
                FileName    = Path.GetFileName(file.FileName)
            });
        }
    }
}
