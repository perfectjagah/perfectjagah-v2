# PerfectJagah – Real Estate Portal

A full-stack real estate portal built with **React + Vite + Tailwind CSS** (frontend) and **ASP.NET Core 10 Web API** (backend), backed by **SQL Server**.

---

## Project Structure

```
perfectjagah-v2/
├── backend/        ← ASP.NET Core 10 Web API
└── frontend/       ← React + Vite + Tailwind CSS
```

---

## Quick Start (Development)

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (local or Docker)
- [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet): `dotnet tool install --global dotnet-ef`

---

### 1. Backend Setup

```bash
cd backend

# Configure your connection string in appsettings.Development.json:
# "DefaultConnection": "Server=localhost;Database=PerfectJagahDb;Trusted_Connection=True;TrustServerCertificate=True;"

# Apply EF Core migrations (creates the database and tables)
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API
dotnet run
```

API will be available at `http://localhost:5000`  
Swagger UI: `http://localhost:5000/swagger`

**Default admin credentials:**

- Username: `admin`
- Password: `Admin@123`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure the API URL (already set to http://localhost:5000)
# Edit .env if needed: VITE_API_BASE_URL=http://localhost:5000

# Start the dev server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## Environment Variables

### Backend (`appsettings.json` / environment)

| Variable                               | Description                    | Default                 |
| -------------------------------------- | ------------------------------ | ----------------------- |
| `ConnectionStrings__DefaultConnection` | SQL Server connection string   | `(local SQL)`           |
| `JwtSettings__Secret`                  | JWT signing key (min 32 chars) | `CHANGE_ME...`          |
| `JwtSettings__Issuer`                  | Token issuer                   | `PerfectJagah`          |
| `JwtSettings__ExpiryHours`             | Token expiry                   | `24`                    |
| `AllowedOrigin`                        | CORS allowed origin            | `http://localhost:5173` |

### Frontend (`.env`)

| Variable            | Description          |
| ------------------- | -------------------- |
| `VITE_API_BASE_URL` | Backend API base URL |

---

## API Reference

### Public Endpoints

| Method | URL                                     | Description            |
| ------ | --------------------------------------- | ---------------------- |
| `GET`  | `/api/properties`                       | List/search properties |
| `GET`  | `/api/properties/{id}`                  | Property detail        |
| `GET`  | `/api/properties/{id}/similar`          | Similar properties     |
| `GET`  | `/api/properties/{id}/images/{imageId}` | Serve property image   |
| `POST` | `/api/inquiries`                        | Submit an inquiry      |
| `POST` | `/api/auth/login`                       | Admin login            |

### Protected Admin Endpoints (Bearer JWT required)

| Method           | URL                          | Description              |
| ---------------- | ---------------------------- | ------------------------ |
| `GET`            | `/api/admin/dashboard`       | Dashboard stats          |
| `GET/POST`       | `/api/admin/properties`      | List / Create            |
| `GET/PUT/DELETE` | `/api/admin/properties/{id}` | Detail / Update / Delete |
| `GET/PUT/DELETE` | `/api/admin/inquiries/{id}`  | Inquiry management       |

---

## Deployment (Railway)

1. Push both `backend/` and `frontend/` to GitHub
2. Create a **Railway** project
3. Add a **SQL Server** database service (or use Railway's PostgreSQL + change EF provider)
4. Deploy `backend/` as a service:
   - Build command: `dotnet publish -c Release`
   - Set env vars: `ConnectionStrings__DefaultConnection`, `JwtSettings__Secret`, `AllowedOrigin`
5. Deploy `frontend/` as a service:
   - Build arg: `VITE_API_BASE_URL=https://your-backend.railway.app`

---

## Tech Stack

- **Frontend**: React 18 + Vite 5 + TypeScript + Tailwind CSS v4 + TanStack Query + React Router v6
- **Backend**: ASP.NET Core 10 Web API + Entity Framework Core 9 + BCrypt.Net + Swashbuckle
- **Database**: SQL Server (images stored as `varbinary(MAX)`)
- **Auth**: JWT Bearer (HS256)
