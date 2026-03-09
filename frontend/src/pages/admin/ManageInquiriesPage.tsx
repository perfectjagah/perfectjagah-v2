import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getAdminInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Pagination } from "@/components/shared/Pagination";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import type { Inquiry } from "@/types";

const STATUS_OPTIONS = ["New", "Contacted", "Closed"];

const STATUS_VARIANT = {
  New: "warning",
  Contacted: "success",
  Closed: "secondary",
} as const;

export default function ManageInquiriesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [detailTarget, setDetailTarget] = useState<Inquiry | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries", { page }],
    queryFn: () => getAdminInquiries({ page, pageSize: 15 }),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateInquiryStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    },
    onError: () => toast("Failed to update status.", "error"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteInquiry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast("Inquiry deleted.", "success");
      setDeleteTarget(null);
    },
    onError: () => toast("Failed to delete inquiry.", "error"),
  });

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Inquiries</h1>
        {data && (
          <p className="text-sm text-muted-400 mt-0.5">
            {data.totalCount} total inquir{data.totalCount !== 1 ? "ies" : "y"}
          </p>
        )}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : data?.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-muted-200 bg-white p-16 text-center">
          <MessageSquare
            size={32}
            className="mx-auto mb-3 text-muted-400 opacity-40"
          />
          <p className="text-muted-400 font-medium">No inquiries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-muted-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-muted-200 bg-muted text-xs font-semibold text-muted-400 uppercase tracking-widest">
            <div className="col-span-3">Contact</div>
            <div className="col-span-3">Property</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-muted-200">
            {data?.items?.map((inq) => (
              <div
                key={inq.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 hover:bg-muted/50 transition-colors items-center"
              >
                {/* Contact */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-bold shrink-0">
                    {inq.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {inq.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-400 truncate">
                      <Mail size={10} />
                      <span className="truncate">{inq.email}</span>
                    </div>
                    {inq.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-400">
                        <Phone size={10} />
                        <span>{inq.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property */}
                <div className="col-span-3 min-w-0">
                  <Link
                    to={`/properties/${inq.propertyId}`}
                    className="text-sm font-medium text-charcoal hover:text-amber-600 transition-colors line-clamp-2 flex items-start gap-1"
                  >
                    {inq.propertyTitle}
                    <ExternalLink
                      size={11}
                      className="shrink-0 mt-0.5 opacity-50"
                    />
                  </Link>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <p className="text-xs text-muted-400">
                    {formatDate(inq.createdAt)}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <select
                    value={inq.status}
                    onChange={(e) =>
                      statusMut.mutate({ id: inq.id, status: e.target.value })
                    }
                    className="text-xs border border-muted-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white cursor-pointer font-medium"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setDetailTarget(inq)}
                    className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted-200 text-xs font-medium text-charcoal transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setDeleteTarget(inq)}
                    className="p-1.5 rounded-xl text-muted-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && (
        <Pagination
          page={page}
          pageSize={15}
          totalCount={data.totalCount}
          onChange={(p) => setPage(p)}
        />
      )}

      {/* Detail dialog */}
      <Dialog
        open={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        title="Inquiry Details"
      >
        {detailTarget && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-400 uppercase tracking-wider mb-1">
                  Name
                </p>
                <p className="font-semibold text-charcoal">
                  {detailTarget.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-400 uppercase tracking-wider mb-1">
                  Status
                </p>
                <Badge
                  variant={
                    STATUS_VARIANT[
                      detailTarget.status as keyof typeof STATUS_VARIANT
                    ] ?? "secondary"
                  }
                >
                  {detailTarget.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-400 uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="font-medium text-charcoal">{detailTarget.email}</p>
            </div>
            {detailTarget.phone && (
              <div>
                <p className="text-xs text-muted-400 uppercase tracking-wider mb-1">
                  Phone
                </p>
                <p className="font-medium text-charcoal">
                  {detailTarget.phone}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-400 uppercase tracking-wider mb-1">
                Property
              </p>
              <p className="font-medium text-charcoal">
                {detailTarget.propertyTitle}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-400 uppercase tracking-wider mb-1">
                Message
              </p>
              <p className="text-gray-700 leading-relaxed bg-muted rounded-xl p-3">
                {detailTarget.message}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-400">
                Received {formatDate(detailTarget.createdAt)}
              </p>
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button variant="secondary" onClick={() => setDetailTarget(null)}>
            Close
          </Button>
        </div>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Inquiry"
      >
        <p className="text-sm text-muted-400 mt-1">
          Are you sure you want to delete the inquiry from{" "}
          <span className="font-semibold text-charcoal">
            {deleteTarget?.name}
          </span>
          ? This cannot be undone.
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
