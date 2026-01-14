import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { sendFriendRequest } from "@/services/socialService";

export async function POST(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);

        const { recipientId } = await request.json();

        if (!recipientId) {
            return NextResponse.json({ error: "Recipient ID required" }, { status: 400 });
        }

        const result = await sendFriendRequest(decodedToken.uid, recipientId);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error sending friend request:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
