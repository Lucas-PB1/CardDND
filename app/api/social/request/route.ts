import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
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

        await adminDb.collection("notifications").add({
            userId: recipientId,
            type: "friend_request",
            title: "New Friend Request",
            body: `${decodedToken.name || decodedToken.email || "Someone"} sent you a friend request.`,
            data: {
                requesterId: decodedToken.uid,
                requestId: result.id
            },
            isRead: false,
            createdAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error sending friend request:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
