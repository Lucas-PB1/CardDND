import { User, updateProfile } from "firebase/auth";

import { ProfileFormData } from "@/schemas/profileSchema";

import { BaseApiService } from "./baseApiService";
import { UserProfile } from "./userService";

const API_URL = "/api/user/profile";

export class ProfileClientService extends BaseApiService {
    async getProfile() {
        return this.get<UserProfile>(API_URL);
    }

    async updateUserProfileApi(data: Partial<ProfileFormData> & { photoURL?: string | null }) {
        return this.patch<UserProfile, typeof data>(API_URL, data);
    }

    async updateAuthProfile(user: User, displayName: string, photoURL?: string | null) {
        await updateProfile(user, {
            displayName,
            photoURL,
        });
    }

    formatDateForInput(date: Date | string | undefined): string | undefined {
        if (!date) return undefined;
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    }
}

export const profileClient = new ProfileClientService();
