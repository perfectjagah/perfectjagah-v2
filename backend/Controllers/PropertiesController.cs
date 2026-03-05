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
    private readonly IDocumentRepository _documents;

    public PropertiesController(IPropertyRepository props, IImageRepository images, IDocumentRepository documents)
    {
        _props     = props;
        _images    = images;
        _documents = documents;
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

    /// <summary>List document metadata for a property (no binary data).</summary>
    [HttpGet("{propertyId:int}/documents")]
    public async Task<IActionResult> ListDocuments(int propertyId)
    {
        var prop = await _props.GetDetailAsync(propertyId);
        if (prop is null) return NotFound();
        var docs = await _documents.GetByPropertyAsync(propertyId);
        var dtos = docs.Select(d => new DocumentInfoDto(d.Id, d.FileName, d.DisplayName, d.ContentType)).ToList();
        return Ok(dtos);
    }

    /// <summary>Stream a single document (PDF / DOCX).</summary>
    [HttpGet("{propertyId:int}/documents/{documentId:int}")]
    public async Task<IActionResult> GetDocument(int propertyId, int documentId)
    {
        var doc = await _documents.GetAsync(documentId);
        if (doc is null || doc.PropertyId != propertyId) return NotFound();
        // Serve inline so PDFs open in-browser; browsers will fall back to download for other types
        Response.Headers.Append("Content-Disposition", $"inline; filename=\"{doc.FileName}\"");
        return File(doc.DocumentData, doc.ContentType);
    }
}
