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

    formatDateForInput(date: Date | string | { toDate: () => Date } | undefined): string | undefined {
        if (!date) return undefined;
        let d: Date;
        if (typeof date === "object" && "toDate" in date && typeof date.toDate === "function") {
            d = date.toDate();
        } else {
            d = new Date(date as string | Date);
        }
        return d.toISOString().split("T")[0];
    }
}

export const profileClient = new ProfileClientService();
