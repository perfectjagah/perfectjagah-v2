using Microsoft.EntityFrameworkCore;
using PerfectJagah.API.Models;

namespace PerfectJagah.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Property> Properties => Set<Property>();
    public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Property ──────────────────────────────────────────────────────
        modelBuilder.Entity<Property>(e =>
        {
            e.HasIndex(p => p.Location);
            e.HasIndex(p => p.PropertyType);
            e.HasIndex(p => p.Price);
            e.HasIndex(p => p.IsActive);

            e.HasMany(p => p.Images)
             .WithOne(i => i.Property)
             .HasForeignKey(i => i.PropertyId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasMany(p => p.Inquiries)
             .WithOne(i => i.Property)
             .HasForeignKey(i => i.PropertyId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Inquiry ───────────────────────────────────────────────────────
        modelBuilder.Entity<Inquiry>(e =>
        {
            e.HasIndex(i => i.Status);
            e.HasIndex(i => i.PropertyId);
            e.Property(i => i.PropertyId).IsRequired(false);
        });

        // ── PropertyImage ─────────────────────────────────────────────────
        modelBuilder.Entity<PropertyImage>(e =>
        {
            e.HasIndex(i => i.PropertyId);
        });

        // ── AdminUser ─────────────────────────────────────────────────────
        modelBuilder.Entity<AdminUser>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
        });
    }

    /// <summary>Seeds the default admin user if none exists.</summary>
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.AdminUsers.Any())
        {
            context.AdminUsers.Add(new AdminUser
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin"
            });
            await context.SaveChangesAsync();
        }
    }
}
