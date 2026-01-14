import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { ProfileFormData } from "@/schemas/profileSchema";
import { profileClient } from "@/services/profileClientService";
import { storageService } from "@/services/storageService";

export function useProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
        null,
    );
    const [defaultValues, setDefaultValues] = useState<Partial<ProfileFormData> | undefined>(
        undefined,
    );

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        } else if (user) {
            fetchProfile();
        }
    }, [user, authLoading, router]);

    const fetchProfile = async () => {
        try {
            const data = await profileClient.getProfile();

            setDefaultValues({
                displayName: data.displayName,
                hasPlayedBefore: data.hasPlayedBefore,
                birthDate: profileClient.formatDateForInput(data.birthDate),
                avatar: undefined,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            let photoURL = user.photoURL;
            if (data.avatar) {
                photoURL = await storageService.uploadAvatar(user.uid, data.avatar);
            }

            await profileClient.updateAuthProfile(user, data.displayName, photoURL);

            await profileClient.updateUserProfileApi({
                displayName: data.displayName,
                photoURL: photoURL,
                birthDate:
                    data.birthDate instanceof Date
                        ? data.birthDate.toISOString()
                        : new Date(data.birthDate).toISOString(),
                hasPlayedBefore: data.hasPlayedBefore,
            });

            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    return {
        loading: authLoading || loading,
        saving,
        message,
        defaultValues,
        onSubmit,
    };
}
