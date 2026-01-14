import { UserProfile, userService } from "@/services/userService";

import { BaseController } from "./BaseController";

export class AdminController extends BaseController {
    async getUsers(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const adminProfile = await userService.getUserProfile(decodedToken.uid);

            if (adminProfile?.role !== "admin") {
                return this.errorResponse(new Error("Unauthorized: Admin access required"));
            }

            const users = await userService.getAllUsers();
            return this.jsonResponse(users);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async updateUserRole(request: Request, params: { uid: string }) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const adminProfile = await userService.getUserProfile(decodedToken.uid);

            if (adminProfile?.role !== "admin") {
                return this.errorResponse(new Error("Unauthorized: Admin access required"));
            }

            const { uid } = params;
            const body = await request.json();
            const allowedFields: (keyof UserProfile)[] = ["role", "isActive", "hasPlayedBefore"];
            const updates: Partial<UserProfile> = {};

            for (const field of allowedFields) {
                if (body[field] !== undefined) {
                    updates[field] = body[field];
                }
            }

            if (Object.keys(updates).length === 0) {
                return this.errorResponse(new Error("Invalid: No valid fields to update"));
            }

            const data = await userService.updateUserProfile(uid, updates);
            return this.jsonResponse(data);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }
}

export const adminController = new AdminController();
