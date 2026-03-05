// ── Property ──────────────────────────────────────────────────────────────────

export interface PropertySummary {
  id: number;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  areaSqFt: number;
  createdAt: string;
  isActive: boolean;
  primaryImageId: number | null;
}

export interface ImageInfo {
  id: number;
  fileName: string;
  contentType: string;
}

export interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  areaSqFt: number;
  amenities: string | null;
  createdAt: string;
  isActive: boolean;
  images: ImageInfo[];
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  areaSqFt: number;
  amenities?: string;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  isActive?: boolean;
}

// ── Inquiry ───────────────────────────────────────────────────────────────────

export interface Inquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: string;
}

export interface CreateInquiryData {
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalInquiries: number;
  newInquiries: number;
  recentInquiries: Inquiry[];
}

// ── Search filters ────────────────────────────────────────────────────────────

export interface PropertyFilters {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  pageSize?: number;
}
