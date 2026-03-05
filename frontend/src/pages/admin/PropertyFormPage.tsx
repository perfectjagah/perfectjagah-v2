import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Upload,
  X,
  ChevronLeft,
  ImagePlus,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  getAdminPropertyDetail,
  createProperty,
  updateProperty,
} from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { CreatePropertyData, UpdatePropertyData } from "@/types";

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Plot",
  "House",
  "Commercial",
] as const;

const IMAGE_BASE = "/api/images";

interface FormState {
  title: string;
  description: string;
  price: string;
  location: string;
  propertyType: string;
  areaSqFt: string;
  amenities: string;
  isActive: boolean;
}

const EMPTY: FormState = {
  title: "",
  description: "",
  price: "",
  location: "",
  propertyType: "Apartment",
  areaSqFt: "",
  amenities: "",
  isActive: true,
};

export default function PropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  // Load existing property
  const { data: existingProp, isLoading: loadingProp } = useQuery({
    queryKey: ["admin-property-form", id],
    queryFn: () => getAdminPropertyDetail(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingProp) {
      setForm({
        title: existingProp.title,
        description: existingProp.description,
        price: String(existingProp.price),
        location: existingProp.location,
        propertyType: existingProp.propertyType,
        areaSqFt: String(existingProp.areaSqFt),
        amenities: existingProp.amenities ?? "",
        isActive: existingProp.isActive,
      });
    }
  }, [existingProp]);

  const createMut = useMutation({
    mutationFn: (payload: { data: CreatePropertyData; images: File[] }) =>
      createProperty(payload.data, payload.images),
    onSuccess: () => {
      toast("Property created successfully.", "success");
      navigate("/admin/properties");
    },
    onError: () => toast("Failed to create property.", "error"),
  });

  const updateMut = useMutation({
    mutationFn: (payload: {
      data: UpdatePropertyData;
      newImgs: File[];
      delIds: number[];
    }) =>
      updateProperty(Number(id), payload.data, payload.newImgs, payload.delIds),
    onSuccess: () => {
      toast("Property updated successfully.", "success");
      navigate("/admin/properties");
    },
    onError: () => toast("Failed to update property.", "error"),
  });

  const isPending = createMut.isPending || updateMut.isPending;

  // Validation
  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (!form.location.trim()) e.location = "Location is required";
    if (
      !form.areaSqFt ||
      isNaN(Number(form.areaSqFt)) ||
      Number(form.areaSqFt) <= 0
    )
      e.areaSqFt = "Enter a valid area";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: CreatePropertyData = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      location: form.location.trim(),
      propertyType: form.propertyType,
      areaSqFt: Number(form.areaSqFt),
      amenities: form.amenities.trim() || undefined,
    };
    if (isEdit) {
      updateMut.mutate({
        data: { ...payload, isActive: form.isActive },
        newImgs: newImages,
        delIds: deleteImageIds,
      });
    } else {
      createMut.mutate({ data: payload, images: newImages });
    }
  };

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setNewImages((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setNewPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }, []);

  const removeNewImage = (idx: number) => {
    setNewImages((p) => p.filter((_, i) => i !== idx));
    setNewPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const toggleDeleteExisting = (imgId: number) =>
    setDeleteImageIds((p) =>
      p.includes(imgId) ? p.filter((x) => x !== imgId) : [...p, imgId],
    );

  const set =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
    };

  if (isEdit && loadingProp) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-400">
        <Loader2 size={16} className="animate-spin" />
        Loading property…
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/properties")}
          className="w-9 h-9 rounded-xl bg-white border border-muted-200 flex items-center justify-center text-muted-400 hover:text-charcoal hover:border-muted-300 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">
            {isEdit ? "Edit Property" : "New Property"}
          </h1>
          {isEdit && existingProp && (
            <p className="text-xs text-muted-400 mt-0.5 truncate max-w-sm">
              {existingProp.title}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left: Main fields (2 cols) ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <FormCard>
              <FormLabel htmlFor="title">Property Title</FormLabel>
              <input
                id="title"
                value={form.title}
                onChange={set("title")}
                placeholder="e.g. Modern 3BHK Apartment in DHA"
                className={inputCls(!!errors.title)}
              />
              {errors.title && <FieldError>{errors.title}</FieldError>}
            </FormCard>

            {/* Description */}
            <FormCard>
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                id="description"
                value={form.description}
                onChange={set("description")}
                rows={5}
                placeholder="Describe the property in detail…"
                className={`${inputCls(!!errors.description)} resize-none`}
              />
              {errors.description && (
                <FieldError>{errors.description}</FieldError>
              )}
            </FormCard>

            {/* Price + Area */}
            <div className="grid grid-cols-2 gap-4">
              <FormCard>
                <FormLabel htmlFor="price">Price (PKR)</FormLabel>
                <input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={set("price")}
                  placeholder="0"
                  className={inputCls(!!errors.price)}
                />
                {errors.price && <FieldError>{errors.price}</FieldError>}
              </FormCard>
              <FormCard>
                <FormLabel htmlFor="areaSqFt">Area (sq ft)</FormLabel>
                <input
                  id="areaSqFt"
                  type="number"
                  min={0}
                  value={form.areaSqFt}
                  onChange={set("areaSqFt")}
                  placeholder="0"
                  className={inputCls(!!errors.areaSqFt)}
                />
                {errors.areaSqFt && <FieldError>{errors.areaSqFt}</FieldError>}
              </FormCard>
            </div>

            {/* Location + Type */}
            <div className="grid grid-cols-2 gap-4">
              <FormCard>
                <FormLabel htmlFor="location">Location</FormLabel>
                <input
                  id="location"
                  value={form.location}
                  onChange={set("location")}
                  placeholder="e.g. Lahore, Punjab"
                  className={inputCls(!!errors.location)}
                />
                {errors.location && <FieldError>{errors.location}</FieldError>}
              </FormCard>
              <FormCard>
                <FormLabel htmlFor="propertyType">Property Type</FormLabel>
                <select
                  id="propertyType"
                  value={form.propertyType}
                  onChange={set("propertyType")}
                  className={inputCls(false)}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormCard>
            </div>

            {/* Amenities */}
            <FormCard>
              <FormLabel htmlFor="amenities">
                Amenities{" "}
                <span className="text-xs text-muted-400 font-normal">
                  (optional, comma-separated)
                </span>
              </FormLabel>
              <input
                id="amenities"
                value={form.amenities}
                onChange={set("amenities")}
                placeholder="e.g. Swimming Pool, Gym, Parking, 24/7 Security"
                className={inputCls(false)}
              />
            </FormCard>
          </div>

          {/* ── Right: Images + Settings ── */}
          <div className="space-y-4">
            {/* Status (edit only) */}
            {isEdit && (
              <FormCard>
                <p className="text-sm font-semibold text-charcoal mb-3">
                  Listing Status
                </p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() =>
                      setForm((p) => ({ ...p, isActive: !p.isActive }))
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      form.isActive ? "bg-amber-500" : "bg-muted-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        form.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-charcoal">
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </label>
                <p className="text-xs text-muted-400 mt-2">
                  {form.isActive
                    ? "Visible to the public"
                    : "Hidden from public listings"}
                </p>
              </FormCard>
            )}

            {/* Existing images (edit) */}
            {isEdit && existingProp && existingProp.images.length > 0 && (
              <FormCard>
                <p className="text-sm font-semibold text-charcoal mb-3">
                  Current Images
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {existingProp.images.map((img) => {
                    const marked = deleteImageIds.includes(img.id);
                    return (
                      <div key={img.id} className="relative group">
                        <img
                          src={`${IMAGE_BASE}/${img.id}`}
                          alt={img.fileName}
                          className={`w-full aspect-square object-cover rounded-xl transition ${
                            marked ? "opacity-40 grayscale" : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleDeleteExisting(img.id)}
                          className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow text-white text-xs transition ${
                            marked
                              ? "bg-green-500"
                              : "bg-red-500 opacity-0 group-hover:opacity-100"
                          }`}
                          title={marked ? "Undo remove" : "Remove image"}
                        >
                          {marked ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <X size={12} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {deleteImageIds.length > 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    {deleteImageIds.length} image
                    {deleteImageIds.length !== 1 ? "s" : ""} will be removed on
                    save
                  </p>
                )}
              </FormCard>
            )}

            {/* Upload new images */}
            <FormCard>
              <p className="text-sm font-semibold text-charcoal mb-3">
                {isEdit ? "Add More Images" : "Property Images"}
              </p>

              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                  dragOver
                    ? "border-amber-500 bg-amber-50"
                    : "border-muted-200 hover:border-amber-400 hover:bg-amber-50/50"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <ImagePlus size={18} className="text-amber-600" />
                </div>
                <p className="text-sm font-medium text-charcoal">
                  Drop images here
                </p>
                <p className="text-xs text-muted-400">or click to browse</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />

              {/* New image previews */}
              {newPreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {newPreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt=""
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FormCard>
          </div>
        </div>

        {/* Submit bar */}
        <div className="mt-6 flex items-center justify-end gap-3 py-4 border-t border-muted-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/properties")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            <Upload size={14} />
            {isEdit ? "Save Changes" : "Create Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-muted-200 shadow-sm p-5">
      {children}
    </div>
  );
}

function FormLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-charcoal mb-2"
    >
      {children}
    </label>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-red-500 font-medium">{children}</p>;
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-xl border px-4 py-2.5 text-sm bg-white",
    "focus:outline-none focus:ring-2 focus:ring-amber-400 transition",
    hasError
      ? "border-red-300 focus:ring-red-300"
      : "border-muted-200 hover:border-muted-300",
  ].join(" ");
}
