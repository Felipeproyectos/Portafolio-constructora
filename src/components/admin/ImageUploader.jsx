import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";

export default function ImageUploader({ onUpload, multiple = false, label = "Subir imagen", accept = "image/*" }) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const result = await base44.integrations.Core.UploadFile({ file });
        urls.push(result.file_url);
      }
      setPreviews([...previews, ...urls]);
      onUpload(multiple ? urls : urls[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block">
        <div className="border-2 border-dashed border-border hover:border-primary transition-colors p-8 text-center cursor-pointer group">
          {uploading ? (
            <Loader2 size={24} className="animate-spin mx-auto text-primary" />
          ) : (
            <Upload size={24} className="mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-2" />
          )}
          <p className="text-sm text-muted-foreground">{uploading ? "Subiendo..." : label}</p>
          <p className="font-mono text-xs text-muted-foreground/60 mt-1">
            {multiple ? "Puede seleccionar múltiples archivos" : "Haga clic para seleccionar"}
          </p>
        </div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles([...e.target.files])}
        />
      </label>
      {previews.length > 0 && (
        <div className={`mt-4 grid gap-2 ${multiple ? "grid-cols-4" : "grid-cols-1"}`}>
          {previews.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-muted">
              <Image src={url} alt="" fittingType="fill" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}