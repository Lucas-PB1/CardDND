import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProfileFormData } from "@/schemas/profileSchema";
import { uploadAvatar } from "@/services/storageService";
import {
    getProfile,
    updateUserProfileApi,
    updateAuthProfile,
    formatDateForInput
} from "@/services/profileClientService";

export function useProfile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [defaultValues, setDefaultValues] = useState<Partial<ProfileFormData> | undefined>(undefined);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        } else if (user) {
            fetchProfile();
        }
    }, [user, authLoading, router]);

    const fetchProfile = async () => {
        try {
            const token = await user?.getIdToken();
            if (!token) return;

            const data = await getProfile(token);

            setDefaultValues({
                displayName: data.displayName,
                hasPlayedBefore: data.hasPlayedBefore,
                birthDate: formatDateForInput(data.birthDate) as any,
                avatar: undefined
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
                photoURL = await uploadAvatar(user.uid, data.avatar);
            }

            await updateAuthProfile(user, data.displayName, photoURL);

            const token = await user.getIdToken();
            await updateUserProfileApi(token, {
                displayName: data.displayName,
                photoURL: photoURL,
                birthDate: data.birthDate instanceof Date ? data.birthDate.toISOString() : new Date(data.birthDate).toISOString() as any,
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
        onSubmit
    };
}
