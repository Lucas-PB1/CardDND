import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { getSocialConnections } from "@/services/socialService";
import { getUserProfile } from "@/services/userService";

export async function GET(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);

        const connections = await getSocialConnections(decodedToken.uid);

        // Enrich with profiles (N+1 problem usually, but for low numbers ok. Ideally use `getAllUsers` with 'in' query)
        // Optimization: Gather all UIDs
        const otherUserIds = connections.map(c =>
            c.requesterId === decodedToken.uid ? c.recipientId : c.requesterId
        );

        // Fetch profiles in parallel
        // Note: Firestore 'in' limit is 10. For now, doing Promise.all map calling getUserProfile is simpler but slower.
        // A better production approach: use 'in' chunks or cache.

        const connectionsWithProfiles = await Promise.all(connections.map(async (c) => {
            const otherUserId = c.requesterId === decodedToken.uid ? c.recipientId : c.requesterId;
            const profile = await getUserProfile(otherUserId);
            return {
                ...c,
                profile,
                isRequester: c.requesterId === decodedToken.uid
            };
        }));

        return NextResponse.json(connectionsWithProfiles);

    } catch (error: any) {
        console.error("Error fetching friends:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
