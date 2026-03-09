import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { PrivateRoute } from "@/components/shared/PrivateRoute";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";

import PublicLayout from "@/pages/public/PublicLayout";
import AdminLayout from "@/pages/admin/AdminLayout";

import HomePage from "@/pages/public/HomePage";
import PropertyListingPage from "@/pages/public/PropertyListingPage";
import PropertyDetailPage from "@/pages/public/PropertyDetailPage";

import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ManagePropertiesPage from "@/pages/admin/ManagePropertiesPage";
import PropertyFormPage from "@/pages/admin/PropertyFormPage";
import ManageInquiriesPage from "@/pages/admin/ManageInquiriesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <GoogleAnalytics />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="properties" element={<PropertyListingPage />} />
                <Route path="properties/:id" element={<PropertyDetailPage />} />
              </Route>

              <Route path="admin/login" element={<AdminLoginPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="properties" element={<ManagePropertiesPage />} />
                  <Route path="properties/new" element={<PropertyFormPage />} />
                  <Route
                    path="properties/:id/edit"
                    element={<PropertyFormPage />}
                  />
                  <Route path="inquiries" element={<ManageInquiriesPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
