import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { getSocialConnections } from "@/services/socialService";
import { getUsersByIds } from "@/services/userService";

export async function GET(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);

        const connections = await getSocialConnections(decodedToken.uid);

        const otherUserIds = connections.map(c =>
            c.requesterId === decodedToken.uid ? c.recipientId : c.requesterId
        );

        const profiles = await getUsersByIds(otherUserIds);
        const profileMap = new Map(profiles.map(p => [p.uid, p]));

        const connectionsWithProfiles = connections.map(c => {
            const otherUserId = c.requesterId === decodedToken.uid ? c.recipientId : c.requesterId;
            const profile = profileMap.get(otherUserId);

            if (!profile) return null;
            return {
                ...c,
                profile,
                isRequester: c.requesterId === decodedToken.uid
            };
        }).filter(c => c !== null);

        return NextResponse.json(connectionsWithProfiles);

    } catch (error: any) {
        console.error("Error fetching friends:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
