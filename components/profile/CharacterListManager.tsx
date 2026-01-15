"use client";

import { useAuth } from "@/context/AuthContext";
import { CharacterCard } from "./CharacterCard";
import { CharacterForm } from "./CharacterForm";
import { Button } from "@/components/ui/Button";
import { useCharacters } from "@/hooks/useCharacters";

export function CharacterListManager() {
    const { user } = useAuth();
    const {
        characters,
        loading,
        view,
        selectedChar,
        actionLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
        openCreate,
        openEdit,
        closeForm,
    } = useCharacters(user);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (view === "create") {
        return (
            <CharacterForm
                onSubmit={handleCreate}
                onCancel={closeForm}
                isLoading={actionLoading}
            />
        );
    }

    if (view === "edit" && selectedChar) {
        return (
            <CharacterForm
                initialData={selectedChar}
                onSubmit={handleUpdate}
                onCancel={closeForm}
                isLoading={actionLoading}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Characters</h2>
                <Button onClick={openCreate}>+ Add Character</Button>
            </div>

            {characters.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">
                    <p className="mb-4">No characters found.</p>
                    <Button variant="outline" onClick={openCreate}>
                        Create your first character
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {characters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
