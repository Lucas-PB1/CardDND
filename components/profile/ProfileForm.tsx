"use client";

import { DefaultValues } from "react-hook-form";

import { AvatarField } from "@/components/profile/AvatarField";
import { CustomComponentProps, FieldConfig, GenericForm } from "@/components/ui/GenericForm";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { ProfileFormData, profileSchema } from "@/schemas/profileSchema";

export function ProfileForm() {
    const { user } = useAuth();
    const { loading, saving, message, defaultValues, onSubmit } = useProfile();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
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
        <div className="min-h-screen bg-gray-950 px-4 pt-24 pb-12 text-white">
            <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
                <h1 className="mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-center text-3xl font-bold text-transparent">
                    Your Profile
                </h1>

                {message && (
                    <div
                        className={`mb-6 rounded-lg p-4 ${message.type === "success" ? "border border-green-500/30 bg-green-500/20 text-green-400" : "border border-red-500/30 bg-red-500/20 text-red-400"}`}
                    >
                        {message.text}
                    </div>
                )}

                {defaultValues && (
                    <GenericForm<ProfileFormData>
                        schema={profileSchema}
                        onSubmit={onSubmit}
                        fields={fields}
                        submitText="Save Changes"
                        defaultValues={defaultValues as DefaultValues<ProfileFormData>}
                        loading={saving}
                    />
                )}
            </div>
        </div>
    );
}
