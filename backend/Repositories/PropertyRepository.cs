using Microsoft.EntityFrameworkCore;
using PerfectJagah.API.Data;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly AppDbContext _db;

    public PropertyRepository(AppDbContext db) => _db = db;

    public async Task<PagedResult<PropertySummaryDto>> GetPagedAsync(
        string? location, string? type,
        decimal? minPrice, decimal? maxPrice,
        int? minArea, int? maxArea,
        string? sort, int page, int pageSize,
        bool includeInactive = false)
    {
        var query = _db.Properties
            .AsNoTracking()
            .Where(p => includeInactive || p.IsActive);

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(p => p.Location.Contains(location));

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(p => p.PropertyType == type);

        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
        if (minArea.HasValue)  query = query.Where(p => p.AreaSqFt >= minArea.Value);
        if (maxArea.HasValue)  query = query.Where(p => p.AreaSqFt <= maxArea.Value);

        query = sort switch
        {
            "price_asc"  => query.OrderBy(p => p.Price),
            "price_desc" => query.OrderByDescending(p => p.Price),
            _            => query.OrderByDescending(p => p.CreatedAt)
        };

        var total = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PropertySummaryDto(
                p.Id,
                p.Title,
                p.Price,
                p.Location,
                p.PropertyType,
                p.AreaSqFt,
                p.CreatedAt,
                p.IsActive,
                p.Images.Select(i => (int?)i.Id).FirstOrDefault()
            ))
            .ToListAsync();

        return new PagedResult<PropertySummaryDto>(items, total, page, pageSize);
    }

    public async Task<PropertyDetailDto?> GetDetailAsync(int id, bool includeInactive = false)
    {
        var p = await _db.Properties
            .AsNoTracking()
            .Include(p => p.Images)
            .Where(p => p.Id == id && (includeInactive || p.IsActive))
            .FirstOrDefaultAsync();

        if (p is null) return null;

        return new PropertyDetailDto(
            p.Id, p.Title, p.Description, p.Price,
            p.Location, p.PropertyType, p.AreaSqFt, p.Amenities,
            p.CreatedAt, p.IsActive,
            p.Images.Select(i => new ImageInfoDto(i.Id, i.FileName, i.ContentType)).ToList()
        );
    }

    public Task<Property?> GetEntityAsync(int id) =>
        _db.Properties.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<List<PropertySummaryDto>> GetSimilarAsync(int propertyId, string type, string location, int take = 4)
    {
        return await _db.Properties
            .AsNoTracking()
            .Where(p => p.IsActive && p.Id != propertyId &&
                        (p.PropertyType == type || p.Location.Contains(location)))
            .OrderByDescending(p => p.CreatedAt)
            .Take(take)
            .Select(p => new PropertySummaryDto(
                p.Id, p.Title, p.Price, p.Location, p.PropertyType, p.AreaSqFt,
                p.CreatedAt, p.IsActive,
                p.Images.Select(i => (int?)i.Id).FirstOrDefault()
            ))
            .ToListAsync();
    }

    public async Task<Property> CreateAsync(Property property)
    {
        _db.Properties.Add(property);
        await _db.SaveChangesAsync();
        return property;
    }

    public async Task UpdateAsync(Property property)
    {
        _db.Properties.Update(property);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        var prop = await _db.Properties.FindAsync(id);
        if (prop is null) return false;
        prop.IsActive = false;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(int total, int active)> GetCountsAsync()
    {
        var total  = await _db.Properties.CountAsync();
        var active = await _db.Properties.CountAsync(p => p.IsActive);
        return (total, active);
    }
}
