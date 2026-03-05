using Microsoft.EntityFrameworkCore;
using PerfectJagah.API.Data;
using PerfectJagah.API.Models;
using PerfectJagah.API.Repositories.Interfaces;

namespace PerfectJagah.API.Repositories;

public class DocumentRepository : IDocumentRepository
{
    private readonly AppDbContext _db;

    public DocumentRepository(AppDbContext db) => _db = db;

    public Task<PropertyDocument?> GetAsync(int id) =>
        _db.PropertyDocuments.FindAsync(id).AsTask();

    public Task<List<PropertyDocument>> GetByPropertyAsync(int propertyId) =>
        _db.PropertyDocuments
           .AsNoTracking()
           .Where(d => d.PropertyId == propertyId)
           .OrderBy(d => d.DisplayName)
           // Projection: never load DocumentData (varbinary) for metadata-only queries
           .Select(d => new PropertyDocument
           {
               Id           = d.Id,
               PropertyId   = d.PropertyId,
               FileName     = d.FileName,
               DisplayName  = d.DisplayName,
               ContentType  = d.ContentType,
               UploadedAt   = d.UploadedAt,
               DocumentData = Array.Empty<byte>()
           })
           .ToListAsync();

    public async Task<PropertyDocument> AddAsync(PropertyDocument document)
    {
        _db.PropertyDocuments.Add(document);
        await _db.SaveChangesAsync();
        return document;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var doc = await _db.PropertyDocuments.FindAsync(id);
        if (doc is null) return false;
        _db.PropertyDocuments.Remove(doc);
        await _db.SaveChangesAsync();
        return true;
    }
}
