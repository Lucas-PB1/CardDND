import { ProfileFormData } from "@/schemas/profileSchema";
import { User, updateProfile } from "firebase/auth";

const API_URL = "/api/user/profile";

export async function getProfile(token: string) {
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }

    return response.json();
}

export async function updateUserProfileApi(token: string, data: Partial<ProfileFormData> & { photoURL?: string | null }) {
    const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update profile");
    }

    return response.json();
}

export async function updateAuthProfile(user: User, displayName: string, photoURL?: string | null) {
    await updateProfile(user, {
        displayName,
        photoURL,
    });
}

export function formatDateForInput(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}
