import { useState, useEffect } from "react";

export function useFilePreview(file: File | undefined | null, fallbackUrl?: string | null) {
    const [preview, setPreview] = useState<string | null>(fallbackUrl || null);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(fallbackUrl || null);
        }
    }, [file, fallbackUrl]);

    return preview;
}
