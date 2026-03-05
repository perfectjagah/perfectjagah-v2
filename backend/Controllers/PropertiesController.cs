using Microsoft.AspNetCore.Mvc;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Controllers;

/// <summary>Public property endpoints – no authentication required.</summary>
[ApiController]
[Route("api/properties")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyRepository _props;
    private readonly IImageRepository    _images;

    public PropertiesController(IPropertyRepository props, IImageRepository images)
    {
        _props  = props;
        _images = images;
    }

    /// <summary>Search / list properties with optional filters and pagination.</summary>
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] string? location,
        [FromQuery] string? type,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int? minArea,
        [FromQuery] int? maxArea,
        [FromQuery] string? sort = "newest",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12)
    {
        pageSize = Math.Clamp(pageSize, 1, 50);
        page     = Math.Max(page, 1);

        var result = await _props.GetPagedAsync(
            location, type, minPrice, maxPrice, minArea, maxArea,
            sort, page, pageSize);

        return Ok(result);
    }

    /// <summary>Get full detail for a single property.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Detail(int id)
    {
        var dto = await _props.GetDetailAsync(id);
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    /// <summary>Get similar properties.</summary>
    [HttpGet("{id:int}/similar")]
    public async Task<IActionResult> Similar(int id)
    {
        var detail = await _props.GetDetailAsync(id);
        if (detail is null) return NotFound();
        var similar = await _props.GetSimilarAsync(id, detail.PropertyType, detail.Location);
        return Ok(similar);
    }

    /// <summary>Stream an image by ID.</summary>
    [HttpGet("{propertyId:int}/images/{imageId:int}")]
    public async Task<IActionResult> GetImage(int propertyId, int imageId)
    {
        var img = await _images.GetAsync(imageId);
        if (img is null || img.PropertyId != propertyId) return NotFound();
        return File(img.ImageData, img.ContentType, img.FileName);
    }
}
