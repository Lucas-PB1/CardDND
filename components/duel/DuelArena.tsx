import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { duelService } from "@/services/duelService";
import { DuelMatch, DuelPlayer, DuelPhase } from "@/schemas/duelSchema";
import { DuelCard } from "@/components/duel/DuelCard";
import { Button } from "@/components/ui/Button";
import { ArrowUpCircle, PlayCircle, Shield } from "lucide-react";

interface DuelArenaProps {
    matchId: string;
}

export function DuelArena({ matchId }: DuelArenaProps) {
    const { user } = useAuth();
    const [match, setMatch] = useState<DuelMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = duelService.subscribeToMatch(matchId, (updatedMatch) => {
            setMatch(updatedMatch);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [matchId]);

    if (!user || loading || !match) {
        return <div className="flex items-center justify-center p-10 text-dnd-gold">Loading Arena...</div>;
    }

    const currentPlayer = match.players.find(p => p.userId === user.uid);
    const opponent = match.players.find(p => p.userId !== user.uid);

    if (!currentPlayer) return <div>You are not in this match.</div>;

    const isMyTurn = match.currentTurnUserId === user.uid;

    const handleDraw = async () => {
        if (!isMyTurn) return;
        await duelService.drawCard(matchId, user.uid);
    };

    const handlePlayCard = async (cardId: string) => {
        if (!isMyTurn) return;
        await duelService.playCard(matchId, user.uid, cardId);
    };

    const handleEndTurn = async () => {
        if (!isMyTurn) return;
        await duelService.endTurn(matchId, user.uid);
    };

    return (
        <div className="flex flex-col h-screen bg-dnd-bg text-dnd-fg overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/parchment-texture.jpg')] opacity-10 pointer-events-none" />

            {/* --- OPPONENT ZONE (Top) --- */}
            <div className="flex-1 bg-black/20 p-4 flex flex-col items-center justify-center relative border-b border-dnd-border/30">
                {opponent ? (
                    <>
                        <div className="absolute top-4 left-4 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-dnd-crimson border-2 border-dnd-gold flex items-center justify-center text-xl font-bold text-dnd-gold">
                                {opponent.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-dnd-crimson">{opponent.name}</h3>
                                <div className="text-sm font-mono flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> HP: {opponent.hp}/{opponent.maxHp}
                                    <span className="text-xs text-muted-foreground">({opponent.hand.length} cards in hand)</span>
                                </div>
                            </div>
                        </div>

                        {/* Opponent Field */}
                        <div className="flex gap-2 overflow-x-auto max-w-4xl p-2 min-h-[160px] items-center">
                            {opponent.field.map((card) => (
                                <DuelCard key={card.id} card={card} size="sm" />
                            ))}
                            {opponent.field.length === 0 && (
                                <div className="text-muted-foreground/40 italic">Empty Field</div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-xl text-muted-foreground animate-pulse">Waiting for opponent...</div>
                )}
            </div>

            {/* --- MIDDLE ZONE (Turn Info & Log) --- */}
            <div className="h-16 flex items-center justify-between px-8 bg-dnd-parchment border-y border-dnd-gold/50 shadow-inner z-10">
                <div className="font-dnd text-lg font-bold text-dnd-crimson">
                    {isMyTurn ? "YOUR TURN" : `${opponent?.name || "Opponent"}'s TURN`}
                </div>

                <div className="flex-1 mx-4 text-xs text-center text-muted-foreground truncate max-w-lg">
                    {match.log[match.log.length - 1]}
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-dnd-crimson/80">
                        Phase: {match.phase}
                    </div>
                    {isMyTurn && (
                        <Button
                            onClick={handleEndTurn}
                            disabled={loading}
                            className="bg-dnd-crimson text-dnd-gold hover:bg-red-800"
                        >
                            End Turn
                        </Button>
                    )}
                </div>
            </div>

            {/* --- PLAYER ZONE (Bottom) --- */}
            <div className="flex-[1.5] bg-black/10 p-4 flex flex-col justify-end relative">
                {/* Player Field */}
                <div className="flex-1 flex items-center justify-center mb-4">
                    <div className="flex gap-2 overflow-x-auto max-w-4xl p-2 min-h-[180px] items-center border-2 border-dashed border-dnd-gold/20 rounded-lg bg-white/5">
                        {currentPlayer.field.map((card) => (
                            <DuelCard key={card.id} card={card} size="md" />
                        ))}
                        {currentPlayer.field.length === 0 && (
                            <div className="text-muted-foreground/40 italic px-10">Play cards here</div>
                        )}
                    </div>
                </div>

                {/* Player Hand & Controls */}
                <div className="flex items-end justify-center gap-8 pb-4">
                    <div className="relative">
                        <div className="absolute -top-12 left-0 font-bold text-dnd-crimson flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-dnd-gold border border-dnd-crimson flex items-center justify-center text-dnd-crimson">
                                {user.displayName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <div>{currentPlayer.name}</div>
                                <div className="text-xs font-mono">HP: {currentPlayer.hp}/{currentPlayer.maxHp}</div>
                            </div>
                        </div>

                        {/* Deck */}
                        <div
                            onClick={handleDraw}
                            className={`w-24 h-36 bg-dnd-card border-2 border-dnd-border rounded-lg shadow-lg flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform ${!isMyTurn && "opacity-50 cursor-not-allowed"}`}
                        >
                            <div className="absolute inset-1 border border-dotted border-dnd-gold/50 rounded" />
                            <div className="text-center">
                                <span className="block font-dnd text-lg">Deck</span>
                                <span className="text-xs text-muted-foreground">{currentPlayer.deck.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Hand */}
                    <div className="flex gap-[-40px]">
                        <div className="flex gap-2 items-end px-4 py-2 bg-black/20 rounded-t-xl -mb-4 backdrop-blur-md border-t border-dnd-gold/30">
                            {currentPlayer.hand.map((card) => (
                                <DuelCard
                                    key={card.id}
                                    card={card}
                                    size="md"
                                    className="hover:-translate-y-12 transition-transform duration-300 shadow-xl"
                                    isPlayable={isMyTurn}
                                    onClick={() => handlePlayCard(card.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Graveyard */}
                    <div className="w-24 h-36 bg-gray-800/50 border-2 border-gray-600 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center">
                        <div>
                            <span className="block font-bold">Grave</span>
                            <span>{currentPlayer.graveyard.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
