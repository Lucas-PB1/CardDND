"use client";

import { Button } from "@/components/ui/Button";
import { ColumnConfig, GenericTable } from "@/components/ui/GenericTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { UserProfile } from "@/services/userService";

export default function AdminUsers() {
    const { users, loading, message, loadUsers, handleRoleChange, authLoading } = useAdminUsers();

    const columns: ColumnConfig<UserProfile>[] = [
        { header: "Name", key: "displayName" },
        { header: "Email", key: "email" },
        {
            header: "Role",
            key: "role",
            render: (u) => (
                <span
                    className={`rounded px-2 py-1 text-xs font-bold ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}
                >
                    {u.role.toUpperCase()}
                </span>
            ),
        },
        {
            header: "Created At",
            render: (u) => new Date(u.createdAt as string | Date).toLocaleDateString(),
        },
        {
            header: "Actions",
            render: (u) => (
                <Button
                    variant="secondary"
                    className="h-8 px-3 text-xs"
                    onClick={() => handleRoleChange(u.uid, u.role)}
                >
                    {u.role === "admin" ? "Demote" : "Promote"}
                </Button>
            ),
        },
    ];

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-gray-950 px-6 pt-24 text-white">
            <div className="container mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
                        Admin Dashboard
                    </h1>
                    <Button onClick={loadUsers} variant="secondary">
                        Refresh
                    </Button>
                </div>

                {message && (
                    <div
                        className={`mb-6 rounded-lg p-4 ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                        {message.text}
                    </div>
                )}

                <GenericTable<UserProfile>
                    data={users}
                    columns={columns}
                    keyExtractor={(u) => u.uid}
                    loading={loading}
                    emptyMessage="No users found."
                />
            </div>
        </div>
    );
}
