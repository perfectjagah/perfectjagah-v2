using Microsoft.EntityFrameworkCore;
using PerfectJagah.API.Data;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Repositories;

public class ImageRepository : IImageRepository
{
    private readonly AppDbContext _db;

    public ImageRepository(AppDbContext db) => _db = db;

    public Task<PropertyImage?> GetAsync(int id) =>
        _db.PropertyImages.FindAsync(id).AsTask();

    public Task<List<PropertyImage>> GetByPropertyAsync(int propertyId) =>
        _db.PropertyImages
           .AsNoTracking()
           .Where(i => i.PropertyId == propertyId)
           .ToListAsync();

    public async Task<PropertyImage> AddAsync(PropertyImage image)
    {
        _db.PropertyImages.Add(image);
        await _db.SaveChangesAsync();
        return image;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var img = await _db.PropertyImages.FindAsync(id);
        if (img is null) return false;
        _db.PropertyImages.Remove(img);
        await _db.SaveChangesAsync();
        return true;
    }
}
