import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  Shield,
  Star,
  Clock,
  ChevronDown,
  Check,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { PageLoader } from "@/components/shared/LoadingSpinner";

const PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "House", "Commercial"];

const CATEGORIES = [
  {
    type: "Apartment",
    icon: "🏢",
    desc: "Modern flats & apartments",
    count: "120+",
  },
  {
    type: "Villa",
    icon: "🏡",
    desc: "Luxurious villas & bungalows",
    count: "85+",
  },
  {
    type: "Plot",
    icon: "🌿",
    desc: "Residential & commercial plots",
    count: "200+",
  },
  {
    type: "House",
    icon: "🏠",
    desc: "Family homes & residences",
    count: "150+",
  },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Listings",
    desc: "Every property is verified by our team to ensure accuracy and trustworthiness.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Handpicked properties that meet the highest standards for your lifestyle.",
  },
  {
    icon: Clock,
    title: "Updated Daily",
    desc: "Fresh listings added every day so you never miss the perfect property.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(e.target as Node)
      )
        setTypeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => getProperties({ pageSize: 6, sort: "newest" }),
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-[#faf9f6]">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(28,28,30,0.3) 0%, rgba(28,28,30,0.55) 50%, rgba(28,28,30,0.85) 100%)",
          }}
          aria-hidden
        />

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl w-full px-4 pb-12 pt-6 sm:px-6">
          {/* Category chips */}
          <div className="flex gap-2 flex-wrap mb-5">
            {["House", "Apartment", "Residential"].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setType(chip);
                  navigate(`/properties?type=${chip}`);
                }}
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm border border-white/20 hover:bg-white/20 hover:text-white transition-all duration-150"
              >
                {chip}
              </button>
            ))}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] max-w-3xl">
            Build Your Future,{" "}
            <span className="relative">
              <span className="text-amber-400">One Property</span>
            </span>{" "}
            at a Time.
          </h1>
          <p className="mt-5 text-lg text-white/60 max-w-lg">
            Own Your World. One Property at a Time. Thousands of properties
            across Pakistan — search, compare, and connect instantly.
          </p>

          {/* Floating search card */}
          <div className="mt-10 mb-0 rounded-3xl bg-white shadow-2xl p-5 max-w-3xl overflow-visible">
            <p className="text-xs font-semibold text-muted-400 uppercase tracking-widest mb-4">
              Find the best place
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Looking for
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Enter type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full pl-8 pr-3 h-10 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Locations
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="City or area..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-8 pr-3 h-10 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Property Type
                </label>
                <div ref={typeDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setTypeOpen((o) => !o)}
                    className={`w-full h-10 pl-3 pr-8 rounded-xl border text-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white flex items-center justify-between ${
                      typeOpen
                        ? "border-amber-400 ring-2 ring-amber-400"
                        : "border-muted-200 hover:border-amber-300"
                    }`}
                  >
                    <span
                      className={
                        type ? "text-charcoal font-medium" : "text-gray-400"
                      }
                    >
                      {type || "All Types"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${typeOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {typeOpen && (
                    <div className="absolute z-50 bottom-[calc(100%+6px)] left-0 w-full bg-white rounded-2xl shadow-xl border border-muted-100 py-1.5 overflow-hidden">
                      {["", ...PROPERTY_TYPES].map((t) => (
                        <button
                          key={t || "all"}
                          type="button"
                          onClick={() => {
                            setType(t);
                            setTypeOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                            type === t
                              ? "bg-amber-50 text-amber-700 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{t || "All Types"}</span>
                          {type === t && (
                            <Check size={13} className="text-amber-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-white text-sm font-bold shadow-lg shadow-amber-200 transition-all duration-150"
                >
                  <Search size={15} strokeWidth={2.5} />
                  Search Properties
                </button>
              </div>
            </div>
            {/* Filter chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-muted-400 mr-1">Filter:</span>
              {["City", "House", "Residential", "Apartment"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => navigate(`/properties?type=${chip}`)}
                  className="px-3 py-1 rounded-full text-xs bg-muted hover:bg-amber-100 hover:text-amber-700 transition-colors border border-muted-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-muted-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-3 divide-x divide-muted-200">
            {[
              { value: "500+", label: "Properties Listed" },
              { value: "20+", label: "Cities Covered" },
              { value: "1200+", label: "Happy Clients" },
            ].map(({ value, label }) => (
              <div key={label} className="py-6 text-center">
                <p className="text-2xl font-extrabold text-charcoal">{value}</p>
                <p className="text-sm text-muted-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="py-8 bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
                Why PerfectJagah
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal leading-tight">
                Your primary home might begin to feel left out.
              </h2>
              <p className="mt-4 text-muted-400 leading-relaxed">
                With thoughtful design and smart organization, you can maximise
                every inch, making room for creativity and comfort.
              </p>
              <Link to="/properties" className="mt-6 inline-block">
                <Button size="lg">
                  Explore Properties <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-muted-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Icon size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">
                      {title}
                    </p>
                    <p className="text-sm text-muted-400 mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">
                Browse by Type
              </p>
              <h2 className="text-3xl font-extrabold text-charcoal">
                Find your category
              </h2>
            </div>
            <Link
              to="/properties"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.type}
                to={`/properties?type=${cat.type}`}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-muted-200 bg-[#faf9f6] p-6 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200"
              >
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <p className="font-bold text-charcoal group-hover:text-amber-700 transition-colors">
                    {cat.type}
                  </p>
                  <p className="text-xs text-muted-400 mt-0.5">{cat.desc}</p>
                </div>
                <span className="mt-auto text-xs font-semibold text-amber-600">
                  {cat.count} listings
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ─────────────────────────────────────────────── */}
      <section className="py-16 bg-[#faf9f6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">
                Latest
              </p>
              <h2 className="text-3xl font-extrabold text-charcoal">
                Recent Listings
              </h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" size="sm">
                View All <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData?.items.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Big CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#1c1c1e] text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-6">
            <Building2 size={26} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Ready to find your{" "}
            <span className="text-amber-400">dream property?</span>
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Browse all listings or contact us to list your property. It's quick
            and free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/properties">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Properties <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/properties">
              <Button
                size="lg"
                variant="outline-white"
                className="w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
