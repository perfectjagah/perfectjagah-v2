import { Link } from "react-router-dom";
import { MapPin, Maximize2, ArrowRight } from "lucide-react";
import type { PropertySummary } from "@/types";
import { formatPrice, formatArea, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface PropertyCardProps {
  property: PropertySummary;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imgSrc = property.primaryImageId
    ? getImageUrl(property.id, property.primaryImageId)
    : null;

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-muted-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-muted"
        style={{ aspectRatio: "4/3" }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-400 min-h-[200px]">
            <svg
              className="h-16 w-16 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
              />
            </svg>
          </div>
        )}
        {/* Price overlay */}
        <div className="absolute top-3 right-3 bg-[#1c1c1e]/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-xl">
          {formatPrice(property.price)}
        </div>
        {/* Type badge */}
        <Badge className="absolute top-3 left-3" variant="dark">
          {property.propertyType}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-charcoal line-clamp-2 leading-snug text-[15px]">
          {property.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-400">
          <MapPin size={13} className="shrink-0 text-amber-500" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-400">
          <Maximize2 size={13} className="shrink-0 text-amber-500" />
          <span>{formatArea(property.areaSqFt)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
            View Details
          </span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted group-hover:bg-amber-500 group-hover:text-white transition-all duration-200">
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
