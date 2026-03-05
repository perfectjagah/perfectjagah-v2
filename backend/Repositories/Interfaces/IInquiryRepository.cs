using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;

namespace PerfectJagah.API.Repositories.Interfaces;

public interface IInquiryRepository
{
    Task<PagedResult<InquiryDto>> GetPagedAsync(int? propertyId, int page, int pageSize);
    Task<List<InquiryDto>> GetRecentAsync(int take = 5);
    Task<Inquiry?> GetEntityAsync(int id);
    Task<Inquiry> CreateAsync(Inquiry inquiry);
    Task UpdateAsync(Inquiry inquiry);
    Task<bool> DeleteAsync(int id);
    Task<(int total, int newCount)> GetCountsAsync();
}
