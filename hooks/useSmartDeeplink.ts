import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface UseSmartDeeplinkOptions<T extends string> {
    param: string;
    validValues?: readonly T[];
    onMatch: (value: T) => void;
    clearOnMatch?: boolean;
}

/**
 * A hook to handle "Smart Deeplinks" - synchronizing URL query parameters with application state.
 */
export function useSmartDeeplink<T extends string>({
    param,
    validValues,
    onMatch,
    clearOnMatch = false
}: UseSmartDeeplinkOptions<T>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const value = searchParams.get(param);

        if (!value) return;

        if (validValues && !validValues.includes(value as T)) {
            return;
        }

        onMatch(value as T);

        if (clearOnMatch) {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete(param);
            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        }

    }, [searchParams, param, validValues, onMatch, clearOnMatch, router, pathname]);
}
