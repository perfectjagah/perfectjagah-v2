using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;

namespace PerfectJagah.API.Repositories.Interfaces;

public interface IPropertyRepository
{
    Task<PagedResult<PropertySummaryDto>> GetPagedAsync(
        string? location, string? type,
        decimal? minPrice, decimal? maxPrice,
        int? minArea, int? maxArea,
        string? sort, int page, int pageSize,
        bool includeInactive = false);

    Task<PropertyDetailDto?> GetDetailAsync(int id, bool includeInactive = false);
    Task<Property?> GetEntityAsync(int id);
    Task<List<PropertySummaryDto>> GetSimilarAsync(int propertyId, string type, string location, int take = 4);
    Task<Property> CreateAsync(Property property);
    Task UpdateAsync(Property property);
    Task<bool> SoftDeleteAsync(int id);
    Task<(int total, int active)> GetCountsAsync();
}
