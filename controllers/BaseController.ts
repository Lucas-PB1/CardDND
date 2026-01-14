import { NextResponse } from "next/server";
import { auth } from "firebase-admin";

export abstract class BaseController {
    /**
     * Extracts and validates the Firebase ID token from the Authorization header.
     * Returns the decoded token if valid, throws an error otherwise.
     */
    protected async getAuthenticatedUser(request: Request) {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            throw new Error("Unauthorized: Missing Bearer token");
        }

        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = await auth().verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new Error("Unauthorized: Invalid token");
        }
    }

    /**
     * Returns a standard JSON response.
     */
    protected jsonResponse<T>(data: T, status: number = 200) {
        return NextResponse.json(data, { status });
    }

    /**
     * Handles errors and returns an appropriate error response.
     */
    protected errorResponse(error: Error) {
        console.error("API Error:", error);

        let status = 500;
        let message = "Internal Server Error";

        if (error.message.startsWith("Unauthorized")) {
            status = 401;
            message = error.message;
        } else if (error.message === "Profile not found" || error.message.includes("not found")) {
            status = 404;
            message = error.message;
        } else if (error.message.includes("Invalid")) {
            status = 400;
            message = error.message;
        }

        return NextResponse.json({ error: message }, { status });
    }
}
