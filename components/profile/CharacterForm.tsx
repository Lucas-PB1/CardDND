import { useMemo } from "react";
import { FileUp, Loader2 } from "lucide-react";

import { Character, CharacterFormData, characterSchema } from "@/schemas/characterSchema";
import { Button } from "@/components/ui/Button";
import { GenericForm } from "@/components/ui/GenericForm";
import { useCharacterForm } from "@/hooks/useCharacterForm";
import { getCharacterFormFields } from "./characterFormFields";

interface CharacterFormProps {
    initialData?: Character;
    onSubmit: (data: CharacterFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CharacterForm({ initialData, onSubmit, onCancel, isLoading }: CharacterFormProps) {
    const {
        form,
        isParsingPdf,
        fileInputRef,
        handlePdfImport,
        triggerPdfUpload
    } = useCharacterForm({ initialData, onSubmit });

    const fields = useMemo(() => getCharacterFormFields(initialData), [initialData]);

    return (
        <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                    {initialData ? "Edit Character" : "New Character"}
                </h2>
                {!initialData && (
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handlePdfImport}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={triggerPdfUpload}
                            disabled={isParsingPdf || isLoading}
                        >
                            {isParsingPdf ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileUp className="h-4 w-4" />
                            )}
                            Import PDF
                        </Button>
                    </div>
                )}
            </div>

            <GenericForm<CharacterFormData>
                form={form}
                schema={characterSchema}
                onSubmit={onSubmit}
                fields={fields}
                submitText={initialData ? "Save Changes" : "Create Character"}
                loading={isLoading}
            >
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </GenericForm>
        </div>
    );
}
