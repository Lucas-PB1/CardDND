import { useEffect, useState } from "react";

export function useFilePreview(file: File | undefined | null, fallbackUrl?: string | null) {
    const [preview, setPreview] = useState<string | null>(fallbackUrl || null);

    useEffect(() => {
        if (!file) {
            setPreview(fallbackUrl || null);
        }
    }, [file, fallbackUrl]);

    useEffect(() => {
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return preview;
}
