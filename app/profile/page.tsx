"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { CharacterListManager } from "@/components/profile/CharacterListManager";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"account" | "characters">("account");

    return (
        <div className="min-h-screen bg-gray-950 px-4 pt-24 pb-12 text-white">
            <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl">
                <h1 className="mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-center text-3xl font-bold text-transparent">
                    Your Profile
                </h1>

                {/* Tabs Navigation */}
                <div className="mb-8 flex border-b border-gray-700">
                    <button
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "account"
                                ? "border-b-2 border-blue-500 text-blue-400"
                                : "text-gray-400 hover:text-white"
                            }`}
                        onClick={() => setActiveTab("account")}
                    >
                        Account Settings
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "characters"
                                ? "border-b-2 border-blue-500 text-blue-400"
                                : "text-gray-400 hover:text-white"
                            }`}
                        onClick={() => setActiveTab("characters")}
                    >
                        My Characters
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === "account" ? <ProfileForm /> : <CharacterListManager />}
                </div>
            </div>
        </div>
    );
}
