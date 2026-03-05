import { Link } from "react-router-dom";
import {
  Building2,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1c1c1e] text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-bold text-white text-xl mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                <Building2 size={16} className="text-white" />
              </span>
              <span>PerfectJagah</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Pakistan's trusted real estate portal. Find your perfect property
              with confidence.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-amber-500 transition-colors duration-150"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/properties", label: "All Properties" },
                { to: "/properties?type=Apartment", label: "Apartments" },
                { to: "/properties?type=Villa", label: "Villas" },
                { to: "/properties?type=Plot", label: "Plots" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-amber-400 transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Property Types
            </h3>
            <ul className="space-y-3 text-sm">
              {["House", "Commercial", "Penthouse", "Studio", "Farmhouse"].map(
                (t) => (
                  <li key={t}>
                    <Link
                      to={`/properties?type=${t}`}
                      className="hover:text-amber-400 transition-colors duration-150"
                    >
                      {t}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-amber-400" />
                <span>Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-amber-400" />
                <span>+92 300 0000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-amber-400" />
                <span>info@perfectjagah.pk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>
            Â© {new Date().getFullYear()} PerfectJagah. All rights reserved.
          </span>
          <span>Built with care in Pakistan ðŸ‡µðŸ‡°</span>
        </div>
      </div>
    </footer>
  );
}
