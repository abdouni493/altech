import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/api";
import { BUCKETS, type BucketName } from "@/lib/supabase";

/**
 * Image picker with preview.
 * - Upload a file → it's stored in a Supabase Storage bucket and the public
 *   CDN URL is saved back through `onChange`.
 * - Or paste an external image URL directly.
 */
export function ImageInput({
  value,
  onChange,
  className,
  aspect = "aspect-video",
  bucket = BUCKETS.media,
  folder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  aspect?: string;
  bucket?: BucketName;
  folder?: string;
}) {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleFile = async (f?: File) => {
    if (!f) return;
    setError(false);
    setUploading(true);
    try {
      const url = await uploadImage(f, bucket, folder);
      onChange(url);
    } catch (e) {
      console.error("[supabase] image upload failed:", e);
      setError(true);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/5 grid place-items-center cursor-pointer group",
          aspect
        )}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute top-2 end-2 z-10 grid place-items-center h-8 w-8 rounded-lg bg-black/60 text-white hover:bg-moo-rose transition"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="text-center text-moo-muted group-hover:text-moo-ink transition">
            <ImagePlus className="h-7 w-7 mx-auto mb-1" />
            <span className="text-xs">{t("common.upload")}</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-black/55 backdrop-blur-sm">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-moo-rose">{t("common.uploadError")}</p>
      )}

      <input
        type="url"
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… (URL)"
        className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-moo-ink placeholder:text-moo-muted/70 outline-none focus:border-moo-violet/60"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
