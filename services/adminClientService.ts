import { UserProfile } from "@/services/userService";
import { BaseApiService } from "./baseApiService";

export class AdminClientService extends BaseApiService {
    async fetchAllUsers(): Promise<UserProfile[]> {
        return this.get<UserProfile[]>("/api/admin/users");
    }

    async updateUserRole(uid: string, role: "user" | "admin") {
        return this.patch<{ success: boolean }>(`/api/admin/users/${uid}`, { role });
    }
}

export const adminClient = new AdminClientService();

