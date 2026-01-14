import { userService } from "@/services/userService";

import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
    async logAccess(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid, email } = decodedToken;

            const body = await request.json();
            const { action } = body;

            const ip = request.headers.get("x-forwarded-for") || "unknown";
            const ua = request.headers.get("user-agent") || "unknown";

            if (!email) {
                return this.errorResponse(new Error("Invalid: User has no email"));
            }

            await userService.logUserAccess(uid, email, action || "LOGIN", { ip, ua });

            return this.jsonResponse({ success: true });
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }

    async syncUser(request: Request) {
        try {
            const decodedToken = await this.getAuthenticatedUser(request);
            const { uid, email } = decodedToken;

            const body = await request.json();
            const { displayName, photoURL, birthDate, hasPlayedBefore } = body;

            await userService.createUserProfile(uid, {
                email: email || "",
                displayName,
                photoURL,
                birthDate: birthDate ? new Date(birthDate) : undefined,
                hasPlayedBefore: !!hasPlayedBefore,
            });

            return this.jsonResponse({ success: true });
        } catch (error) {
            return this.errorResponse(error as Error);
        }
    }
}

export const authController = new AuthController();
