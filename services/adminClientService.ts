import { auth } from "@/lib/firebase";
import { UserProfile } from "@/services/userService";

export async function fetchAllUsers(): Promise<UserProfile[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const token = await user.getIdToken();

    const response = await fetch("/api/admin/users", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
}

export async function updateUserRole(uid: string, role: "user" | "admin") {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const token = await user.getIdToken();

    const response = await fetch(`/api/admin/users/${uid}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
    });

    if (!response.ok) {
        throw new Error("Failed to update user role");
    }

    return response.json();
}
