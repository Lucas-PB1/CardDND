"use client";

import { useParams } from "next/navigation";
import { DeckDetails } from "@/components/duel/DeckDetails";

export default function DeckDetailsPage() {
    const { characterId, deckId } = useParams<{ characterId: string; deckId: string }>();

    if (!characterId || !deckId) return null;

    return <DeckDetails characterId={characterId} deckId={deckId} />;
}
