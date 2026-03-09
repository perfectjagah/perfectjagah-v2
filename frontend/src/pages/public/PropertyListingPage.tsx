import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  LayoutGrid,
  Map,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getProperties } from "@/lib/api";
import type { PropertyFilters } from "@/types";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { PropertyMap } from "@/components/shared/PropertyMap";
import { Pagination } from "@/components/shared/Pagination";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useDebounce } from "@/hooks/useDebounce";

const PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "House", "Commercial"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low â†’ High" },
  { value: "price_desc", label: "Price: High â†’ Low" },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-muted-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        className="flex items-center justify-between w-full mb-3 group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-semibold text-charcoal uppercase tracking-widest">
          {title}
        </span>
        {open ? (
          <ChevronUp size={13} className="text-muted-400" />
        ) : (
          <ChevronDown size={13} className="text-muted-400" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export default function PropertyListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [locationInput, setLocationInput] = useState(
    searchParams.get("location") ?? "",
  );
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") ?? "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));

  const debouncedLocation = useDebounce(locationInput, 400);

  const filters: PropertyFilters = {
    location: debouncedLocation || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minArea: minArea ? Number(minArea) : undefined,
    maxArea: maxArea ? Number(maxArea) : undefined,
    sort: sort as PropertyFilters["sort"],
    page,
    pageSize: viewMode === "map" ? 20 : 12,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
  });

  useEffect(() => {
    const p = new URLSearchParams();
    if (debouncedLocation) p.set("location", debouncedLocation);
    if (type) p.set("type", type);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (minArea) p.set("minArea", minArea);
    if (maxArea) p.set("maxArea", maxArea);
    if (sort !== "newest") p.set("sort", sort);
    if (page > 1) p.set("page", String(page));
    setSearchParams(p, { replace: true });
  }, [
    debouncedLocation,
    type,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    sort,
    page,
  ]);

  const handleReset = () => {
    setLocationInput("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters = !!(
    locationInput ||
    type ||
    minPrice ||
    maxPrice ||
    minArea ||
    maxArea
  );

  const FilterSidebar = (
    <div className="rounded-2xl border border-muted-200 bg-white p-5 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-charcoal flex items-center gap-2 text-sm">
          <Filter size={14} className="text-amber-500" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <FilterSection title="Location">
        <input
          type="text"
          placeholder="City or area..."
          value={locationInput}
          onChange={(e) => {
            setLocationInput(e.target.value);
            setPage(1);
          }}
          className="w-full h-9 px-3 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
        />
      </FilterSection>

      <FilterSection title="Property Type">
        <div className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  type === t
                    ? "bg-amber-500 border-amber-500"
                    : "border-muted-200 group-hover:border-amber-400"
                }`}
                onClick={() => {
                  setType(type === t ? "" : t);
                  setPage(1);
                }}
              >
                {type === t && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M2 5l2.5 2.5L8 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`text-sm transition-colors ${
                  type === t ? "text-amber-700 font-medium" : "text-gray-600"
                }`}
                onClick={() => {
                  setType(type === t ? "" : t);
                  setPage(1);
                }}
              >
                {t}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range (â‚¨)">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 px-3 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 px-3 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
          />
        </div>
      </FilterSection>

      <FilterSection title="Area (sqft)">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minArea}
            onChange={(e) => {
              setMinArea(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 px-3 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxArea}
            onChange={(e) => {
              setMaxArea(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 px-3 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Page header */}
      <div className="border-b border-muted-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-charcoal">
                Properties
              </h1>
              {data && (
                <p className="text-sm text-muted-400 mt-0.5">
                  <span className="font-semibold text-amber-600">
                    {data.totalCount}
                  </span>{" "}
                  {data.totalCount === 1 ? "result" : "results"} found
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="h-9 px-3 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white hidden sm:block"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* View toggle */}
              <div className="flex items-center rounded-xl border border-muted-200 overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-charcoal text-white"
                      : "text-muted-400 hover:text-charcoal"
                  }`}
                >
                  <LayoutGrid size={14} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${
                    viewMode === "map"
                      ? "bg-charcoal text-white"
                      : "text-muted-400 hover:text-charcoal"
                  }`}
                >
                  <Map size={14} />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>

              {/* Mobile filter toggle */}
              <button
                className="flex items-center gap-2 h-9 px-3 rounded-xl border border-muted-200 text-sm font-medium text-charcoal bg-white sm:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Filter size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white overflow-y-auto shadow-2xl transition-transform sm:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-charcoal">Filters</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={18} className="text-muted-400" />
            </button>
          </div>
          {FilterSidebar}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {viewMode === "grid" ? (
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden sm:block w-60 shrink-0">
              {FilterSidebar}
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {isLoading || isFetching ? (
                <PageLoader />
              ) : data?.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-muted-200 bg-white p-16 text-center">
                  <p className="text-muted-400 text-lg font-medium">
                    No properties found.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {data?.items?.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}

              {data && (
                <Pagination
                  page={page}
                  pageSize={12}
                  totalCount={data.totalCount}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          /* Map + list split view */
          <div className="flex gap-4 h-[calc(100vh-200px)]">
            {/* Left: scrollable card list */}
            <div className="w-[400px] shrink-0 overflow-y-auto space-y-3 pr-1">
              {isLoading || isFetching ? (
                <PageLoader />
              ) : data?.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-muted-200 bg-white p-8 text-center">
                  <p className="text-muted-400">No properties found.</p>
                </div>
              ) : (
                data?.items?.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))
              )}
            </div>

            {/* Right: Live map */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-muted-200 shadow-sm">
              {data && data.items.length > 0 ? (
                <PropertyMap properties={data.items} />
              ) : (
                <div className="h-full flex items-center justify-center bg-white">
                  <div className="text-center text-muted-400">
                    <Map size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-sm">No properties to show</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
