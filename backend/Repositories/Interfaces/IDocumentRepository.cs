using PerfectJagah.API.Models;

namespace PerfectJagah.API.Repositories.Interfaces;

public interface IDocumentRepository
{
    Task<PropertyDocument?> GetAsync(int id);
    Task<List<PropertyDocument>> GetByPropertyAsync(int propertyId);
    Task<PropertyDocument> AddAsync(PropertyDocument document);
    Task<bool> DeleteAsync(int id);
}
