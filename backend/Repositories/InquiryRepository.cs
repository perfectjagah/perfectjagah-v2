using Microsoft.EntityFrameworkCore;
using PerfectJagah.API.Data;
using PerfectJagah.API.DTOs;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Repositories;

public class InquiryRepository : IInquiryRepository
{
    private readonly AppDbContext _db;

    public InquiryRepository(AppDbContext db) => _db = db;

    private IQueryable<InquiryDto> ProjectToDto(IQueryable<Inquiry> q) =>
        q.Select(i => new InquiryDto(
            i.Id,
            i.PropertyId ?? 0,
            i.Property != null ? i.Property.Title : "N/A",
            i.Name, i.Email, i.Phone, i.Message,
            i.CreatedAt, i.Status
        ));

    public async Task<PagedResult<InquiryDto>> GetPagedAsync(int? propertyId, int page, int pageSize)
    {
        var query = _db.Inquiries.AsNoTracking()
            .Include(i => i.Property)
            .OrderByDescending(i => i.CreatedAt)
            .AsQueryable();

        if (propertyId.HasValue)
            query = query.Where(i => i.PropertyId == propertyId.Value);

        var total = await query.CountAsync();
        var items = await ProjectToDto(query)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<InquiryDto>(items, total, page, pageSize);
    }

    public async Task<List<InquiryDto>> GetRecentAsync(int take = 5) =>
        await ProjectToDto(
            _db.Inquiries.AsNoTracking()
               .Include(i => i.Property)
               .OrderByDescending(i => i.CreatedAt)
               .Take(take)
        ).ToListAsync();

    public Task<Inquiry?> GetEntityAsync(int id) =>
        _db.Inquiries.FindAsync(id).AsTask();

    public async Task<Inquiry> CreateAsync(Inquiry inquiry)
    {
        _db.Inquiries.Add(inquiry);
        await _db.SaveChangesAsync();
        return inquiry;
    }

    public async Task UpdateAsync(Inquiry inquiry)
    {
        _db.Inquiries.Update(inquiry);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var inq = await _db.Inquiries.FindAsync(id);
        if (inq is null) return false;
        _db.Inquiries.Remove(inq);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(int total, int newCount)> GetCountsAsync()
    {
        var total    = await _db.Inquiries.CountAsync();
        var newCount = await _db.Inquiries.CountAsync(i => i.Status == "New");
        return (total, newCount);
    }
}
