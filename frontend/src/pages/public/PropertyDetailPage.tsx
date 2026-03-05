import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  Maximize2,
  Calendar,
  Home,
  Check,
  ArrowLeft,
  FileText,
  Download,
} from "lucide-react";
import {
  getPropertyDetail,
  getSimilarProperties,
  submitInquiry,
  getDocumentUrl,
} from "@/lib/api";
import type { CreateInquiryData } from "@/types";
import { formatPrice, formatArea, formatDate, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const propId = Number(id);
  const { toast } = useToast();

  const [imgIndex, setImgIndex] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propId],
    queryFn: () => getPropertyDetail(propId),
    enabled: !!propId,
  });

  const { data: similar } = useQuery({
    queryKey: ["similar", propId],
    queryFn: () => getSimilarProperties(propId),
    enabled: !!propId,
  });

  const [form, setForm] = useState<Omit<CreateInquiryData, "propertyId">>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: (data: CreateInquiryData) => submitInquiry(data),
    onSuccess: () => {
      toast("Inquiry submitted! We will contact you soon.", "success");
      setForm({ name: "", email: "", phone: "", message: "" });
    },
    onError: () =>
      toast("Failed to submit inquiry. Please try again.", "error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...form, propertyId: propId });
  };

  if (isLoading) return <PageLoader />;
  if (!property)
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-400">Property not found.</p>
        <Link
          to="/properties"
          className="mt-4 inline-block text-amber-600 hover:text-amber-700 font-medium"
        >
          ← Back to listings
        </Link>
      </div>
    );

  const images = property.images;
  const hasImages = images.length > 0;

  const amenitiesList =
    property.amenities
      ?.split(",")
      .map((a) => a.trim())
      .filter(Boolean) ?? [];

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-muted-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-400">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/properties"
              className="hover:text-amber-600 transition-colors"
            >
              Properties
            </Link>
            <span>/</span>
            <span className="text-charcoal font-medium line-clamp-1">
              {property.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Back button */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-400 hover:text-charcoal transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Images + Details ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden bg-muted aspect-video shadow-lg">
              {hasImages ? (
                <>
                  <img
                    src={getImageUrl(property.id, images[imgIndex].id)}
                    alt={`${property.title} - image ${imgIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                        disabled={imgIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-lg hover:bg-white disabled:opacity-30 transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setImgIndex((i) => Math.min(images.length - 1, i + 1))
                        }
                        disabled={imgIndex === images.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 shadow-lg hover:bg-white disabled:opacity-30 transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                      {/* Dot indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={`rounded-full transition-all duration-200 ${
                              i === imgIndex
                                ? "bg-white w-6 h-2"
                                : "bg-white/50 w-2 h-2"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Image count */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {imgIndex + 1} / {images.length}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-400 min-h-[300px]">
                  <Home size={48} className="opacity-20" />
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setImgIndex(i)}
                    className={`shrink-0 h-16 w-24 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                      i === imgIndex
                        ? "border-amber-500 shadow-md"
                        : "border-transparent hover:border-muted-200"
                    }`}
                  >
                    <img
                      src={getImageUrl(property.id, img.id)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Overview Card */}
            <div className="bg-white rounded-3xl border border-muted-200 shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <Badge variant="default" className="mb-3">
                    {property.propertyType}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal leading-tight">
                    {property.title}
                  </h1>
                  <div className="mt-3 flex items-center gap-2 text-muted-400">
                    <MapPin size={15} className="text-amber-500 shrink-0" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-charcoal">
                    {formatPrice(property.price)}
                  </p>
                  <p className="text-xs text-muted-400 mt-1">Listed price</p>
                </div>
              </div>

              {/* Spec chips */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Home, label: "Type", value: property.propertyType },
                  {
                    icon: Maximize2,
                    label: "Area",
                    value: formatArea(property.areaSqFt),
                  },
                  {
                    icon: Calendar,
                    label: "Listed",
                    value: formatDate(property.createdAt),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#faf9f6] border border-muted-200 p-4"
                  >
                    <Icon size={16} className="text-amber-500" />
                    <p className="text-xs text-muted-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-charcoal text-center">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {property.description && (
                <div className="mt-6">
                  <h3 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-widest">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                    {property.description}
                  </p>
                </div>
              )}

              {amenitiesList.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-widest">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700"
                      >
                        <Check size={11} />
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {property.documents && property.documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-charcoal mb-3 text-sm uppercase tracking-widest">
                    Documents
                  </h3>
                  <div className="flex flex-col gap-2">
                    {property.documents.map((doc) => (
                      <a
                        key={doc.id}
                        href={getDocumentUrl(property.id, doc.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-xl border border-muted-200 bg-[#faf9f6] px-4 py-2.5 text-sm font-medium text-charcoal hover:border-amber-400 hover:bg-amber-50 transition-colors group"
                      >
                        <FileText
                          size={15}
                          className="text-amber-500 shrink-0"
                        />
                        <span className="flex-1 truncate">
                          {doc.displayName || doc.fileName}
                        </span>
                        <Download
                          size={13}
                          className="text-muted-400 group-hover:text-amber-600 transition-colors shrink-0"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Price + Inquiry Form ─────────────────────────────── */}
          <div className="space-y-5">
            {/* Price card */}
            <div className="bg-[#1c1c1e] rounded-3xl p-6 text-white shadow-xl">
              <p className="text-white/50 text-sm uppercase tracking-widest mb-1">
                Price
              </p>
              <p className="text-3xl font-extrabold text-amber-400">
                {formatPrice(property.price)}
              </p>
              <p className="text-white/40 text-xs mt-1">Negotiable</p>
              <div className="mt-5 space-y-2">
                <Button
                  className="w-full"
                  onClick={() =>
                    document
                      .getElementById("inquiry-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <MessageSquare size={15} />
                  Request Information
                </Button>
              </div>
            </div>

            {/* Inquiry form card */}
            <div
              id="inquiry-form"
              className="bg-white rounded-3xl border border-muted-200 shadow-sm p-6"
            >
              <h2 className="font-bold text-charcoal text-lg mb-1">
                Send an Inquiry
              </h2>
              <p className="text-sm text-muted-400 mb-5">
                Get in touch with us about this property.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <Phone
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Muhammad Ali"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="w-full pl-8 pr-3 h-10 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                    />
                    <input
                      type="email"
                      placeholder="you@email.com"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full pl-8 pr-3 h-10 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 300 0000000"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full px-3 h-10 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Message
                  </label>
                  <textarea
                    placeholder="I am interested in this property..."
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-muted-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-muted/50 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  loading={mutation.isPending}
                >
                  <MessageSquare size={15} />
                  Send Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Similar Properties ─────────────────────────────────────────── */}
        {similar && similar.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
                  You may also like
                </p>
                <h2 className="text-2xl font-extrabold text-charcoal">
                  Similar Properties
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
