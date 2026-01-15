"use client";

import { useState } from "react";
import { User, LogOut, Sword } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { CharacterListManager } from "@/components/profile/CharacterListManager";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type Tab = "account" | "characters";

export function ProfileDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("account");
    const { user, logout } = useAuth();

    const navItems = [
        { id: "account", label: "Account Settings", icon: User },
        { id: "characters", label: "My Characters", icon: Sword },
    ];

    return (
        <div className="min-h-screen bg-dnd-bg px-4 pt-24 pb-12 text-dnd-fg transition-colors duration-300">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-8 md:flex-row">
                    {/* Sidebar */}
                    <aside className="w-full shrink-0 md:w-64">
                        <div className="overflow-hidden rounded-2xl border border-dnd-border bg-dnd-card shadow-xl">
                            {/* User Summary Section */}
                            <div className="relative h-24 bg-gradient-to-br from-dnd-crimson to-dnd-red">
                                <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-2xl border-4 border-dnd-card bg-dnd-bg shadow-lg">
                                    {user?.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "Avatar"}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-dnd-parchment text-2xl font-bold uppercase text-dnd-gold">
                                            {user?.displayName?.[0] || user?.email?.[0] || "?"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-12 px-6 pb-6 pt-2">
                                <h2 className="line-clamp-1 text-lg font-black text-dnd-fg">
                                    {user?.displayName || "Adventurer"}
                                </h2>
                                <p className="line-clamp-1 text-xs text-dnd-fg/50">{user?.email}</p>
                            </div>

                            <nav className="border-t border-dnd-border p-2">
                                <div className="space-y-1">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id as Tab)}
                                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === item.id
                                                ? "bg-dnd-red/10 text-dnd-red shadow-[inset_0_0_20px_rgba(190,30,45,0.05)]"
                                                : "text-dnd-fg/60 hover:bg-dnd-red/5 hover:text-dnd-red"
                                                }`}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            <div className="border-t border-dnd-border p-2">
                                <button
                                    onClick={() => logout()}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-dnd-fg/40 transition-all hover:bg-dnd-red/10 hover:text-dnd-red"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        <div className="rounded-2xl border border-dnd-border bg-dnd-card p-8 shadow-2xl">
                            <div className="mb-8">
                                <h1 className="text-3xl font-black tracking-tight text-dnd-fg">
                                    {activeTab === "account" ? "Account Settings" : "My Characters"}
                                </h1>
                                <p className="mt-1 text-sm text-dnd-fg/50">
                                    {activeTab === "account"
                                        ? "Manage your personal information and account preferences."
                                        : "Manage your D&D characters and sheets."}
                                </p>
                            </div>

                            <div>
                                {activeTab === "account" ? <ProfileForm /> : <CharacterListManager />}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
