using PerfectJagah.API.Models;

namespace PerfectJagah.API.Repositories.Interfaces;

public interface IImageRepository
{
    Task<PropertyImage?> GetAsync(int id);
    Task<List<PropertyImage>> GetByPropertyAsync(int propertyId);
    Task<PropertyImage> AddAsync(PropertyImage image);
    Task<bool> DeleteAsync(int id);
}
