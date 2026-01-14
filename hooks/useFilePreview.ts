import { useEffect, useState } from "react";

export function useFilePreview(file: File | undefined | null, fallbackUrl?: string | null) {
    const [preview, setPreview] = useState<string | null>(fallbackUrl || null);

    if (!file && preview !== fallbackUrl) {
        setPreview(fallbackUrl || null);
    }

    useEffect(() => {
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);

        queueMicrotask(() => {
            setPreview(objectUrl);
        });

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return preview;
}
