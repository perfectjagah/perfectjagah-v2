import { Link, NavLink } from "react-router-dom";
import { Building2, Menu, X, Home, List } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/properties", label: "Properties", icon: List },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1c1c1e] shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-white text-xl tracking-tight"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
            <Building2 size={18} className="text-white" />
          </span>
          <span>PerfectJagah</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl text-sm font-medium border border-white/20 text-white/70 hover:border-white/50 hover:text-white transition-all duration-150"
          >
            Admin
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="sm:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/10 bg-[#1c1c1e] px-4 pb-5 pt-3 flex flex-col gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <l.icon size={15} />
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 pt-2 border-t border-white/10">
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-medium border border-white/20 text-white/70 hover:text-white transition-all"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
