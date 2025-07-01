"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  trigger: React.ReactNode;
}

export default function ImageUpload({
  onImageUpload,
  trigger,
}: ImageUploadProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);

      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);

    try {
      // Simuler un upload (en réalité, vous utiliseriez un service comme Cloudinary, AWS S3, etc.)
      // Pour la démo, on va créer une URL de données
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(imageUrl);
        setOpen(false);
        handleClose();
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setUploadedFile(null);
    setUploading(false);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Partager une image
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!preview ? (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-slate-400"
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-sm text-slate-600 mb-2">
                  {isDragActive
                    ? "Déposez l'image ici..."
                    : "Glissez-déposez une image ici, ou cliquez pour sélectionner"}
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Prévisualisation"
                    className="w-full max-h-64 object-contain rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setPreview(null);
                      setUploadedFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ImageIcon className="h-4 w-4" />
                  <span>{uploadedFile?.name}</span>
                  <span className="text-slate-400">
                    ({(uploadedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadedFile || uploading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upload...
                </>
              ) : (
                "Envoyer l'image"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
