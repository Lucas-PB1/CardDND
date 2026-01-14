import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { updateUserProfile, getUserProfile } from "@/services/userService";

async function checkAdmin(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await auth().verifyIdToken(token);
        const userProfile = await getUserProfile(decodedToken.uid);

        if (userProfile?.role !== "admin") {
            return null;
        }

        return decodedToken;
    } catch (error) {
        console.error("Auth check failed:", error);
        return null;
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ uid: string }> }
) {
    const adminUser = await checkAdmin(request);
    if (!adminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { uid } = await params;
        const body = await request.json();
        const allowedFields = ["role", "isActive", "hasPlayedBefore"];
        const updates: any = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const data = await updateUserProfile(uid, updates);
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
