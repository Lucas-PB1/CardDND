import Image from "next/image";
import { Upload, X } from "lucide-react";

interface CardImageUploadProps {
    previewUrl: string | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

export function CardImageUpload({ previewUrl, fileInputRef, onFileChange, onRemoveImage }: CardImageUploadProps) {
    return (
        <div>
            <label className="block text-sm font-bold text-dnd-crimson mb-1">Card Image</label>
            <div
                className={`relative aspect-[3/4] w-full rounded-lg border-2 border-dashed transition-colors flex flex-col items-center justify-center overflow-hidden ${previewUrl ? 'border-dnd-gold bg-dnd-parchment/20' : 'border-dnd-border hover:border-dnd-gold/50 hover:bg-dnd-parchment/50 cursor-pointer'
                    }`}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <>
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveImage();
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Click to upload image</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                />
            </div>
        </div>
    );
}
