import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import { getAllUsers, getUserProfile } from "@/services/userService";

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

export async function GET(request: Request) {
    const adminUser = await checkAdmin(request);
    if (!adminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const users = await getAllUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
