"use client";

import { GenericTable, ColumnConfig } from "@/components/ui/GenericTable";
import { UserProfile } from "@/services/userService";
import { Button } from "@/components/ui/Button";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export default function AdminUsers() {
    const { users, loading, message, loadUsers, handleRoleChange, authLoading } = useAdminUsers();

    const columns: ColumnConfig<UserProfile>[] = [
        { header: "Name", key: "displayName" },
        { header: "Email", key: "email" },
        { 
            header: "Role", 
            key: "role",
            render: (u) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {u.role.toUpperCase()}
                </span>
            )
        },
        { 
            header: "Created At", 
            render: (u) => new Date(u.createdAt as string | Date).toLocaleDateString() 
        },
        {
            header: "Actions",
            render: (u) => (
                <Button 
                    variant="secondary" 
                    className="text-xs h-8 px-3"
                    onClick={() => handleRoleChange(u.uid, u.role)}
                >
                    {u.role === "admin" ? "Demote" : "Promote"}
                </Button>
            )
        }
    ];

    if (authLoading) return null;

    return (
        <div className="min-h-screen pt-24 px-6 bg-gray-950 text-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <Button onClick={loadUsers} variant="secondary">Refresh</Button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
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
