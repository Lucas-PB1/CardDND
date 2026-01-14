import { useState, useEffect } from "react";
import { UserProfile } from "@/services/userService";
import { adminClient } from "@/services/adminClientService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function useAdminUsers() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login");
            } else {
                loadUsers();
            }
        }
    }, [user, authLoading, router]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminClient.fetchAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
            setMessage({ type: "error", text: "Failed to load users. Are you an admin?" });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (uid: string, currentRole: "user" | "admin") => {
        const newRole = currentRole === "user" ? "admin" : "user";
        if (!confirm(`Change role to ${newRole}?`)) return;

        try {
            await adminClient.updateUserRole(uid, newRole);
            setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            setMessage({ type: "success", text: "Role updated successfully" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update role" });
        }
    };

    return {
        users,
        loading,
        message,
        loadUsers,
        handleRoleChange,
        authLoading
    };
}
