import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  Home,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/properties", icon: Home, label: "Properties" },
  { to: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  // Derive current page title from route
  const currentItem = navItems.find((n) => location.pathname.startsWith(n.to));

  return (
    <div className="flex h-screen bg-[#faf9f6] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col bg-[#1c1c1e] transition-all duration-200 shadow-xl
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "w-16" : "w-56"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center border-b border-white/10 p-4 h-16 ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 shrink-0">
            <Building2 size={16} className="text-white" />
          </span>
          {!collapsed && (
            <span className="font-bold text-white text-sm">PerfectJagah</span>
          )}
          {/* Close on mobile */}
          {!collapsed && (
            <button
              className="ml-auto lg:hidden text-white/40 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto mt-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-all duration-150 group relative ${
                  collapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-500 rounded-r-full" />
                  )}
                  <Icon
                    size={16}
                    className={isActive ? "text-amber-400" : ""}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                  {/* Tooltip on collapsed */}
                  {collapsed && (
                    <span className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-charcoal text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-2 border-t border-white/10">
          <div
            className={`flex items-center rounded-xl p-3 ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.username[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-white/30">{user?.role}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="text-white/30 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center border-b border-muted-200 bg-white px-4 gap-4 shrink-0 shadow-sm">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-muted-400 hover:text-charcoal transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-muted hover:bg-muted-200 text-charcoal transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2">
            {currentItem && (
              <currentItem.icon size={16} className="text-amber-500" />
            )}
            <h1 className="font-semibold text-charcoal text-sm">
              {currentItem?.label ?? "Admin"}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.username[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-charcoal">
                {user?.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
