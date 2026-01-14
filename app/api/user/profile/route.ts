import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserProfile, updateUserProfile } from "@/services/userService";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const profile = await getUserProfile(uid);

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const serializedProfile = {
            ...profile,
            birthDate: profile.birthDate instanceof Date
                ? profile.birthDate.toISOString()
                : profile.birthDate?.toDate().toISOString(),
            createdAt: profile.createdAt instanceof Date
                ? profile.createdAt.toISOString()
                : profile.createdAt?.toDate().toISOString(),
            updatedAt: profile.updatedAt instanceof Date
                ? profile.updatedAt.toISOString()
                : profile.updatedAt.toDate().toISOString(),
        };

        return NextResponse.json(serializedProfile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const { uid } = decodedToken;

        const body = await request.json();
        const { displayName, photoURL, birthDate, hasPlayedBefore } = body;

        const updateData: any = {};
        if (displayName !== undefined) updateData.displayName = displayName;
        if (photoURL !== undefined) updateData.photoURL = photoURL;
        if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
        if (hasPlayedBefore !== undefined) updateData.hasPlayedBefore = hasPlayedBefore;

        const updatedProfile = await updateUserProfile(uid, updateData);

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
