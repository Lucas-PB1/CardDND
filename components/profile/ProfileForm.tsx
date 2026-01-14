"use client";

import { useAuth } from "@/context/AuthContext";
import { profileSchema, ProfileFormData } from "@/schemas/profileSchema";
import { GenericForm, FieldConfig } from "@/components/ui/GenericForm";
import { useProfile } from "@/hooks/useProfile";
import { AvatarField } from "@/components/profile/AvatarField";

export function ProfileForm() {
    const { user } = useAuth();
    const { loading, saving, message, defaultValues, onSubmit } = useProfile();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const fields: FieldConfig<ProfileFormData>[] = [
        {
            name: "avatar",
            type: "file",
            component: (props: any) => (
                <AvatarField 
                    {...props} 
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
            colSpan: 2
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-950 text-white">
            <div className="max-w-2xl mx-auto bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Your Profile
                </h1>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {message.text}
                    </div>
                )}
                
                {defaultValues && (
                    <GenericForm<ProfileFormData>
                        schema={profileSchema}
                        onSubmit={onSubmit}
                        fields={fields}
                        submitText="Save Changes"
                        defaultValues={defaultValues as any}
                        loading={saving}
                    />
                )}
            </div>
        </div>
    );
}
