using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PerfectJagah.API.Data;
using PerfectJagah.API.Helpers;
using PerfectJagah.API.Middleware;
using PerfectJagah.API.Repositories;
using PerfectJagah.API.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ── Connection string: prefer MSSQL_URL env var (Railway), else appsettings ───
static string ResolveConnectionString(IConfiguration config)
{
    var mssqlUrl = Environment.GetEnvironmentVariable("MSSQL_URL");
    if (!string.IsNullOrWhiteSpace(mssqlUrl))
    {
        // Format: sqlserver://user:pass@host:port
        var uri = new Uri(mssqlUrl);
        var userInfo = uri.UserInfo.Split(':', 2);
        var user     = Uri.UnescapeDataString(userInfo[0]);
        var pass     = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        var host     = uri.Host;
        var port     = uri.Port > 0 ? uri.Port : 1433;
        return $"Server={host},{port};Database=PerfectJagahDb;User Id={user};Password={pass};TrustServerCertificate=True;";
    }
    return config.GetConnectionString("DefaultConnection")
           ?? throw new InvalidOperationException("No connection string configured.");
}

// ── Database ──────────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseSqlServer(
        ResolveConnectionString(builder.Configuration),
        sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", "dbo")));

// ── Repositories ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IInquiryRepository,  InquiryRepository>();
builder.Services.AddScoped<IImageRepository,    ImageRepository>();builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
// ── Helpers ───────────────────────────────────────────────────────────────────
builder.Services.AddSingleton<JwtHelper>();

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["JwtSettings:Secret"]
                ?? throw new InvalidOperationException("JwtSettings:Secret is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer           = true,
            ValidIssuer              = builder.Configuration["JwtSettings:Issuer"] ?? "PerfectJagah",
            ValidateAudience         = true,
            ValidAudience            = builder.Configuration["JwtSettings:Issuer"] ?? "PerfectJagah",
            ValidateLifetime         = true,
            ClockSkew                = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = (builder.Configuration["AllowedOrigins"] ?? "http://localhost:5173")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));

// ── Controllers + Swagger ─────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PerfectJagah API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In          = ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'",
        Name        = "Authorization",
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    {
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
                Type = ReferenceType.SecurityScheme,
                Id   = "Bearer"
            }
        },
        Array.Empty<string>()
    }});
});

// ── Increase multipart body size limit (50 MB for multiple image uploads) ─────
builder.WebHost.ConfigureKestrel(opts =>
    opts.Limits.MaxRequestBodySize = 50 * 1024 * 1024);

// ─────────────────────────────────────────────────────────────────────────────

var app = builder.Build();

// ── Auto-migrate & seed ───────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await AppDbContext.SeedAsync(db);
}

// ── Middleware pipeline ───────────────────────────────────────────────────────
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
