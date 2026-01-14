import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { searchUsers } from "@/services/socialService";

export async function GET(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) return NextResponse.json([]);

    try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth().verifyIdToken(token);

        const results = await searchUsers(query, decodedToken.uid);

        const safeResults = results.map(u => ({
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            role: u.role
        }));

        return NextResponse.json(safeResults);

    } catch (error: any) {
        console.error("Error searching users:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
