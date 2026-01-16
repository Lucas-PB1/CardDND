"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateDeckModal } from "@/components/duel/CreateDeckModal";
import { useDuelDecks } from "@/hooks/useDuelDecks";

export function DeckList() {
    const {
        character,
        decks,
        loading,
        user,
        characterId,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleDeleteDeck,
        loadData
    } = useDuelDecks();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-dnd-bg py-20 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/duel" className="flex items-center justify-center w-10 h-10 rounded-full bg-dnd-card border-2 border-dnd-gold text-dnd-crimson hover:bg-dnd-crimson hover:text-dnd-gold transition-colors shadow-md">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-dnd-crimson font-dnd">{character?.name || "Loading..."}'s Decks</h1>
                        <p className="text-sm text-dnd-fg/80">Manage your card collections</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="ml-auto bg-dnd-gold text-dnd-crimson hover:bg-white font-bold gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Deck
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dnd-gold border-t-transparent"></div>
                    </div>
                ) : decks.length === 0 ? (
                    <div className="text-center py-20 bg-dnd-card rounded-xl border-2 border-dnd-border border-dashed">
                        <p className="text-dnd-fg/60 mb-4">No decks created yet.</p>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Create your first deck</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {decks.map((deck) => (
                            <Link href={`/duel/${characterId}/deck/${deck.id}`} key={deck.id} className="group block bg-dnd-card border-2 border-dnd-border rounded-xl p-6 hover:border-dnd-gold transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] relative">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleDeleteDeck(e, deck.id)}
                                        className="text-dnd-fg/40 hover:text-dnd-crimson p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-dnd-crimson mb-2 pr-8">{deck.name}</h3>
                                {deck.description && <p className="text-sm text-dnd-fg/80 mb-4 line-clamp-2">{deck.description}</p>}
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>Created {new Date(deck.createdAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <CreateDeckModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                characterId={characterId}
                onDeckCreated={loadData}
            />
        </div>
    );
}
