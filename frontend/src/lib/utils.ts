import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10_000_000) return `₨ ${(price / 10_000_000).toFixed(1)} Crore`;
  if (price >= 100_000) return `₨ ${(price / 100_000).toFixed(1)} Lakh`;
  return `₨ ${price.toLocaleString()}`;
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString()} sqft`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getImageUrl(propertyId: number, imageId: number): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
  return `${base}/api/properties/${propertyId}/images/${imageId}`;
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}
