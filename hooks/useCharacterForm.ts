import { useMemo, useRef, useState, useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Character, CharacterFormData, characterSchema } from "@/schemas/characterSchema";
import { extractPdfData } from "@/lib/pdf-utils";
import { pdfParserService } from "@/services/pdfParserService";
import { getEmptyCharacterValues } from "@/lib/characterConstants";

interface UseCharacterFormProps {
    initialData?: Character;
    onSubmit: (data: CharacterFormData) => Promise<void>;
}

export function useCharacterForm({ initialData, onSubmit }: UseCharacterFormProps) {
    const [isParsingPdf, setIsParsingPdf] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultValues: Partial<CharacterFormData> = useMemo(
        () => (initialData ? { ...initialData, image: undefined } : getEmptyCharacterValues()),
        [initialData]
    );

    const form = useForm<CharacterFormData>({
        resolver: yupResolver(characterSchema) as unknown as Resolver<CharacterFormData, any>,
        defaultValues,
    });

    useEffect(() => {
        if (initialData) {
            form.reset(defaultValues);
        }
    }, [initialData, form, defaultValues]);

    const handlePdfImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsingPdf(true);
        try {
            const { text, fields } = await extractPdfData(file);
            const data = pdfParserService.parseCharacterData(text, fields);

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) {
                    form.setValue(key as any, value);
                }
            });
        } catch (error) {
            console.error("Error parsing PDF:", error);
        } finally {
            setIsParsingPdf(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const triggerPdfUpload = () => {
        fileInputRef.current?.click();
    };

    return {
        form,
        isParsingPdf,
        fileInputRef,
        handlePdfImport,
        triggerPdfUpload,
        defaultValues,
    };
}
