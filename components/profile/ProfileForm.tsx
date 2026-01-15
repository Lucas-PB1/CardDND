"use client";

import { useEffect } from "react";
import { DefaultValues, Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AvatarField } from "@/components/profile/AvatarField";
import { CustomComponentProps, FieldConfig, GenericForm } from "@/components/ui/GenericForm";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { ProfileFormData, profileSchema } from "@/schemas/profileSchema";

export function ProfileForm() {
    const { user } = useAuth();
    const { loading, saving, message, defaultValues, onSubmit } = useProfile();

    const form = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema) as unknown as Resolver<ProfileFormData>,
        defaultValues,
    });

    useEffect(() => {
        if (defaultValues && !form.formState.isDirty && !form.formState.isSubmitted) {
            form.reset(defaultValues as DefaultValues<ProfileFormData>);
        }
    }, [defaultValues, form]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-white">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-dnd-red"></div>
            </div>
        );
    }

    const fields: FieldConfig<ProfileFormData>[] = [
        {
            name: "avatar",
            type: "file",
            component: (props: CustomComponentProps<ProfileFormData>) => (
                <AvatarField
                    onChange={props.onChange as (file: File | null) => void}
                    value={props.value as File | undefined}
                    error={props.error}
                    currentPhotoURL={user?.photoURL}
                    displayName={user?.displayName || undefined}
                />
            ),
            colSpan: 2,
        },
        {
            name: "displayName",
            type: "text",
            label: "Display Name",
            placeholder: "Gandalf the Grey",
        },
        {
            name: "birthDate",
            type: "date",
            label: "Birth Date",
        },
        {
            name: "hasPlayedBefore",
            type: "checkbox",
            label: "I have played Dungeons & Dragons before",
            colSpan: 2,
        },
    ];

    return (
        <div className="space-y-6">
            {message && (
                <div
                    className={`mb-6 rounded-lg p-4 ${message.type === "success" ? "border border-green-500/30 bg-green-500/20 text-green-400" : "border border-red-500/30 bg-red-500/20 text-red-400"}`}
                >
                    {message.text}
                </div>
            )}

            {defaultValues && (
                <GenericForm<ProfileFormData>
                    form={form}
                    schema={profileSchema}
                    onSubmit={onSubmit}
                    fields={fields}
                    submitText="Save Changes"
                    loading={saving}
                />
            )}
        </div>
    );
}
