import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { logUserAccess } from "@/services/userService";

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
        const { action } = body;

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const ua = request.headers.get("user-agent") || "unknown";

        if (!email) {
            return NextResponse.json({ error: "User has no email" }, { status: 400 });
        }

        await logUserAccess(uid, email, action || "LOGIN", { ip, ua });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error logging access:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
