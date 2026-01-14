import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { createUserProfile } from "@/services/userService";

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid, email } = decodedToken;

        const body = await request.json();
        const { displayName, photoURL, birthDate, hasPlayedBefore } = body;

        await createUserProfile(uid, {
            email: email || "",
            displayName,
            photoURL,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            hasPlayedBefore: !!hasPlayedBefore,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error syncing user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
