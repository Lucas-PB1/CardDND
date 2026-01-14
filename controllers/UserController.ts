import { BaseController } from "./BaseController";
import { userService, UserProfile } from "@/services/userService";

export class UserController extends BaseController {
    async getProfile(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;

            const profile = await userService.getUserProfile(uid);

            if (!profile) {
                throw new Error("Profile not found");
            }

            const serializeDate = (date: UserProfile['birthDate']) => {
                if (!date) return undefined;
                if (date instanceof Date) return date.toISOString();
                if (typeof date === 'object' && 'toDate' in date) {
                    return (date as { toDate: () => Date }).toDate().toISOString();
                }
                return date as string;
            };

            const serializedProfile = {
                ...profile,
                birthDate: serializeDate(profile.birthDate),
                createdAt: serializeDate(profile.createdAt),
                updatedAt: serializeDate(profile.updatedAt),
            };

            return this.jsonResponse(serializedProfile);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async updateProfile(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid } = decodedToken;

            const body = await request.json();
            const { displayName, photoURL, birthDate, hasPlayedBefore } = body;

            const updateData: Partial<UserProfile> = {};
            if (displayName !== undefined) updateData.displayName = displayName;
            if (photoURL !== undefined) updateData.photoURL = photoURL;
            if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
            if (hasPlayedBefore !== undefined) updateData.hasPlayedBefore = hasPlayedBefore;

            const updatedProfile = await userService.updateUserProfile(uid, updateData);

            return this.jsonResponse(updatedProfile);
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }
}

export const userController = new UserController();
