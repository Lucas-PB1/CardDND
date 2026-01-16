import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AddCardModal } from "@/components/duel/AddCardModal";
import { CreateDeckModal } from "@/components/duel/CreateDeckModal";
import { useDeckDetails, MAX_CARDS } from "@/hooks/useDeckDetails";

interface DeckDetailsProps {
    characterId: string;
    deckId: string;
}

export function DeckDetails({ characterId, deckId }: DeckDetailsProps) {
    const {
        user,
        character,
        deck,
        cards,
        loading,
        modals,
        actions
    } = useDeckDetails(characterId, deckId);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-dnd-bg py-20 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 ">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href={`/duel/${characterId}`} className="flex items-center justify-center w-10 h-10 rounded-full bg-dnd-card border-2 border-dnd-gold text-dnd-crimson hover:bg-dnd-crimson hover:text-dnd-gold transition-colors shadow-md">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <p className="text-sm text-dnd-fg/80">{character?.name} / Decks</p>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-dnd-crimson font-dnd">{deck?.name || "Loading..."}</h1>
                                {deck && (
                                    <button
                                        onClick={() => modals.setIsEditDeckModalOpen(true)}
                                        className="text-dnd-fg/40 hover:text-dnd-gold transition-colors"
                                        title="Edit Deck"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {cards.length < MAX_CARDS && (
                            <Button
                                onClick={() => {
                                    modals.setEditingCard(null);
                                    modals.setIsAddCardModalOpen(true);
                                }}
                                className="ml-auto bg-dnd-gold text-dnd-crimson hover:bg-dnd-crimson hover:text-dnd-gold font-bold gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Card ({cards.length}/{MAX_CARDS})
                            </Button>
                        )}
                    </div>
                    {deck?.description && <p className="text-dnd-fg/80 max-w-2xl">{deck.description}</p>}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dnd-gold border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: MAX_CARDS }).map((_, index) => {
                            const card = cards[index];

                            if (!card) {
                                return (
                                    <div key={`empty-${index}`} className="aspect-[3/4] bg-dnd-card/30 border-2 border-dashed border-dnd-border rounded-xl flex items-center justify-center group hover:bg-dnd-card/50 transition-colors">
                                        <button
                                            onClick={() => {
                                                modals.setEditingCard(null);
                                                modals.setIsAddCardModalOpen(true);
                                            }}
                                            className="text-dnd-fg/30 group-hover:text-dnd-gold transition-colors flex flex-col items-center"
                                        >
                                            <Plus className="w-8 h-8 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Empty Slot</span>
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <div key={card.id} className="group relative bg-dnd-card border-2 border-dnd-border rounded-xl overflow-hidden hover:border-dnd-gold transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] flex flex-col">
                                    <div
                                        className="aspect-[3/4] relative bg-black/40 cursor-pointer"
                                        onClick={() => {
                                            modals.setEditingCard(card);
                                            modals.setIsAddCardModalOpen(true);
                                        }}
                                    >
                                        {card.imageUrl ? (
                                            <Image src={card.imageUrl} alt={card.name} fill className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                                                <span className="text-dnd-parchment/30 text-xs uppercase tracking-widest font-bold">No Image</span>
                                            </div>
                                        )}

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    actions.handleDeleteCard(card.id);
                                                }}
                                                className="bg-black/60 p-2 rounded-full text-white hover:text-red-500 transition-colors backdrop-blur-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                                            <div className="text-xs text-dnd-gold font-bold uppercase tracking-wider mb-1">{card.type}</div>
                                            {card.magicLevel && <div className="text-[10px] text-dnd-azure font-bold uppercase tracking-wider mb-1">{card.magicLevel}</div>}
                                            <h3 className="text-lg font-bold text-white leading-tight">{card.name}</h3>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 bg-dnd-parchment/10 border-t border-dnd-border">
                                        {(card.damage || card.test) && (
                                            <div className="mb-2 space-y-1">
                                                {card.damage && (
                                                    <div className="text-xs font-bold text-dnd-crimson flex justify-between">
                                                        <span>DMG:</span> <span>{card.damage}</span>
                                                    </div>
                                                )}
                                                {card.test && (
                                                    <div className="text-xs font-bold text-dnd-crimson flex justify-between">
                                                        <span>TEST:</span> <span>{card.test}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {card.description && <p className="text-xs text-dnd-fg/80 line-clamp-3">{card.description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <AddCardModal
                isOpen={modals.isAddCardModalOpen}
                onClose={() => {
                    modals.setIsAddCardModalOpen(false);
                    modals.setEditingCard(null);
                }}
                characterId={characterId}
                deckId={deckId}
                existingCard={modals.editingCard}
                onCardAdded={actions.loadData}
            />

            <CreateDeckModal
                isOpen={modals.isEditDeckModalOpen}
                onClose={() => modals.setIsEditDeckModalOpen(false)}
                characterId={characterId}
                existingDeck={deck}
                onDeckCreated={actions.loadData}
            />
        </div>
    );
}
