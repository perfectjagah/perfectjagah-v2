import axios from "axios";
import type {
  AuthUser,
  CreateInquiryData,
  CreatePropertyData,
  DashboardStats,
  Inquiry,
  LoginCredentials,
  PagedResult,
  PropertyDetail,
  PropertyFilters,
  PropertySummary,
  UpdatePropertyData,
} from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({ baseURL: BASE_URL });

// ── Auth interceptor ──────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth_user");
  if (raw) {
    const user: AuthUser = JSON.parse(raw);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("auth_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  },
);

// ── Public: Properties ────────────────────────────────────────────────────────

export const getProperties = (filters: PropertyFilters) =>
  api
    .get<PagedResult<PropertySummary>>("/api/properties", { params: filters })
    .then((r) => r.data);

export const getPropertyDetail = (id: number) =>
  api.get<PropertyDetail>(`/api/properties/${id}`).then((r) => r.data);

export const getSimilarProperties = (id: number) =>
  api
    .get<PropertySummary[]>(`/api/properties/${id}/similar`)
    .then((r) => r.data);

export const getPropertyDocuments = (propertyId: number) =>
  api
    .get<
      import("@/types").DocumentInfo[]
    >(`/api/properties/${propertyId}/documents`)
    .then((r) => r.data);

export const getDocumentUrl = (
  propertyId: number,
  documentId: number,
): string => `${BASE_URL}/api/properties/${propertyId}/documents/${documentId}`;

// ── Public: Inquiries ─────────────────────────────────────────────────────────

export const submitInquiry = (data: CreateInquiryData) =>
  api.post("/api/inquiries", data).then((r) => r.data);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login = (creds: LoginCredentials) =>
  api.post<AuthUser>("/api/auth/login", creds).then((r) => r.data);

// ── Admin: Dashboard ──────────────────────────────────────────────────────────

export const getDashboardStats = () =>
  api.get<DashboardStats>("/api/admin/dashboard").then((r) => r.data);

// ── Admin: Properties ─────────────────────────────────────────────────────────

export const getAdminProperties = (params?: PropertyFilters) =>
  api
    .get<PagedResult<PropertySummary>>("/api/admin/properties", { params })
    .then((r) => r.data);

export const getAdminPropertyDetail = (id: number) =>
  api.get<PropertyDetail>(`/api/admin/properties/${id}`).then((r) => r.data);

export const createProperty = (data: CreatePropertyData, images: File[]) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  images.forEach((img) => form.append("images", img));
  return api
    .post<PropertyDetail>("/api/admin/properties", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const updateProperty = (
  id: number,
  data: UpdatePropertyData,
  newImages: File[],
  deleteImageIds: number[],
) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, String(v));
  });
  newImages.forEach((img) => form.append("images", img));
  deleteImageIds.forEach((id) => form.append("deleteImageIds", String(id)));
  return api.put(`/api/admin/properties/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProperty = (id: number) =>
  api.delete(`/api/admin/properties/${id}`);

export const uploadPropertyDocuments = (id: number, documents: File[]) => {
  const form = new FormData();
  documents.forEach((doc) => form.append("documents", doc));
  return api.post(`/api/admin/properties/${id}/documents`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePropertyDocument = (
  propertyId: number,
  documentId: number,
) => api.delete(`/api/admin/properties/${propertyId}/documents/${documentId}`);

// ── Admin: Inquiries ──────────────────────────────────────────────────────────

export const getAdminInquiries = (params?: {
  propertyId?: number;
  page?: number;
  pageSize?: number;
}) =>
  api
    .get<PagedResult<Inquiry>>("/api/admin/inquiries", { params })
    .then((r) => r.data);

export const updateInquiryStatus = (id: number, status: string) =>
  api.put(`/api/admin/inquiries/${id}`, { status });

export const deleteInquiry = (id: number) =>
  api.delete(`/api/admin/inquiries/${id}`);
