import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Maximize2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getAdminProperties, deleteProperty } from "@/lib/api";
import type { PropertySummary } from "@/types";
import { formatPrice, formatArea, getImageUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Pagination } from "@/components/shared/Pagination";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { useDebounce } from "@/hooks/useDebounce";

export default function ManagePropertiesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<PropertySummary | null>(
    null,
  );

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-properties", { search: debouncedSearch, page }],
    queryFn: () =>
      getAdminProperties({
        location: debouncedSearch || undefined,
        page,
        pageSize: 12,
      }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProperty(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      toast("Property deleted successfully.", "success");
      setDeleteTarget(null);
    },
    onError: () => toast("Failed to delete property.", "error"),
  });

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Properties</h1>
          {data && (
            <p className="text-sm text-muted-400 mt-0.5">
              {data.totalCount} total listing{data.totalCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button onClick={() => navigate("/admin/properties/new")}>
          <Plus size={15} />
          Add Property
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-xs">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-400"
        />
        <input
          type="text"
          placeholder="Search by location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-9 pr-4 h-9 rounded-xl border border-muted-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <PageLoader />
      ) : data?.items?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-muted-200 bg-white p-16 text-center">
          <p className="text-muted-400 font-medium">No properties found.</p>
          <Button
            className="mt-4"
            onClick={() => navigate("/admin/properties/new")}
          >
            <Plus size={14} /> Add First Property
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {data?.items?.map((p) => {
            const imgSrc = p.primaryImageId
              ? getImageUrl(p.id, p.primaryImageId)
              : null;
            return (
              <div
                key={p.id}
                className="group bg-white rounded-2xl border border-muted-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Image */}
                <div
                  className="relative bg-muted overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <MapPin size={32} className="text-muted-400 opacity-30" />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    {p.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/80 backdrop-blur-sm text-emerald-300 text-xs font-semibold">
                        <CheckCircle size={10} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white/60 text-xs font-semibold">
                        <XCircle size={10} />
                        Inactive
                      </span>
                    )}
                  </div>
                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end gap-2 p-3">
                    <button
                      onClick={() => navigate(`/admin/properties/${p.id}/edit`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-charcoal text-xs font-semibold hover:bg-amber-50 transition-colors"
                    >
                      <Pencil size={11} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal text-sm line-clamp-1">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-400">
                        <MapPin size={11} className="text-amber-500" />
                        <span className="line-clamp-1">{p.location}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {p.propertyType}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-charcoal text-sm">
                      {formatPrice(p.price)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-400">
                      <Maximize2 size={11} />
                      {formatArea(p.areaSqFt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Property"
      >
        <p className="text-sm text-muted-400 mt-1">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-charcoal">
            "{deleteTarget?.title}"
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-5 flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteMut.isPending}
            onClick={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
