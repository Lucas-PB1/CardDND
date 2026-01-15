import { useEffect, useMemo } from "react";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Character, CharacterFormData, characterSchema } from "@/schemas/characterSchema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AvatarField } from "@/components/profile/AvatarField";
import { GenericForm, FieldConfig, CustomComponentProps } from "@/components/ui/GenericForm";

interface CharacterFormProps {
    initialData?: Character;
    onSubmit: (data: CharacterFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CharacterForm({ initialData, onSubmit, onCancel, isLoading }: CharacterFormProps) {
    const defaultValues: Partial<CharacterFormData> = initialData
        ? {
            name: initialData.name,
            level: initialData.level,
            class: initialData.class,
            subclass: initialData.subclass,
            gold: initialData.gold,
            experience: initialData.experience,
            dndBeyondUrl: initialData.dndBeyondUrl,
            image: undefined,
        }
        : {
            level: 1,
            gold: 0,
            experience: 0,
        };

    const form = useForm<CharacterFormData>({
        resolver: yupResolver(characterSchema) as unknown as Resolver<CharacterFormData, any>,
        defaultValues,
    });

    useEffect(() => {
        if (initialData) {
            form.reset(defaultValues);
        }
    }, [initialData, form]);

    const fields: FieldConfig<CharacterFormData>[] = useMemo(() => [
        {
            name: "image",
            type: "file",
            label: "Character Avatar",
            colSpan: 2,
            component: (props: CustomComponentProps<CharacterFormData>) => (
                <AvatarField
                    onChange={props.onChange as (file: File | null) => void}
                    value={props.value as File | undefined}
                    error={props.error}
                    currentPhotoURL={initialData?.imageUrl || undefined}
                    displayName={initialData?.name}
                />
            ),
        },
        { name: "name", type: "text", label: "Character Name", placeholder: "e.g. Vax'ildan" },
        { name: "level", type: "number", label: "Level", placeholder: "1-20" },
        { name: "class", type: "text", label: "Class", placeholder: "e.g. Rogue" },
        { name: "subclass", type: "text", label: "Subclass", placeholder: "e.g. Assassin" },
        { name: "gold", type: "number", label: "Gold (GP)" },
        { name: "experience", type: "number", label: "Experience (XP)" },
        {
            name: "dndBeyondUrl",
            type: "text",
            label: "D&D Beyond URL",
            placeholder: "https://www.dndbeyond.com/characters/...",
            colSpan: 2
        },
    ], [initialData?.imageUrl, initialData?.name]);

    return (
        <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
            <h2 className="mb-6 text-xl font-bold text-white">
                {initialData ? "Edit Character" : "New Character"}
            </h2>

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
