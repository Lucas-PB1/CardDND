import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { deleteFriendship, respondToFriendRequest } from "@/services/socialService";

// PATCH: Respond (Accept/Reject)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);
        const { id } = await params;
        const { status } = await request.json();

        if (status !== "accepted" && status !== "rejected") {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const result = await respondToFriendRequest(id, decodedToken.uid, status);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error responding to request:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Cancel Request / Unfriend
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);
        const { id } = await params;

        const result = await deleteFriendship(id, decodedToken.uid);
        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error deleting request:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
