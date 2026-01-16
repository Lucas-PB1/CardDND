"use client";

import Link from "next/link";
import Image from "next/image";
import { useCharacterSelection } from "@/hooks/useCharacterSelection";

export function CharacterSelection() {
    const { user, characters, loading } = useCharacterSelection();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-dnd-bg py-20 px-6">
            <div className="mx-auto max-w-6xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-dnd-crimson font-dnd mb-4">Select a Character</h1>
                    <p className="text-dnd-fg/80 text-lg">Choose a hero to manage their decks and cards.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-dnd-gold border-t-transparent"></div>
                    </div>
                ) : characters.length === 0 ? (
                    <div className="text-center text-dnd-fg/60 bg-dnd-card p-8 rounded-xl border-2 border-dnd-border border-dashed">
                        <p className="mb-4">You don't have any characters yet.</p>
                        <Link href="/create-character" className="text-dnd-gold hover:underline">
                            Create one first!
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {characters.map((char) => (
                            <Link href={`/duel/${char.id}`} key={char.id} className="group relative block overflow-hidden rounded-xl border-2 border-dnd-border bg-dnd-card transition-all hover:border-dnd-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                <div className="aspect-video relative overflow-hidden">
                                    {char.imageUrl ? (
                                        <Image
                                            src={char.imageUrl}
                                            alt={char.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-dnd-gold">
                                            <span className="text-4xl font-bold">{char.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <h2 className="text-2xl font-bold text-white group-hover:text-dnd-gold transition-colors">{char.name}</h2>
                                        <p className="text-sm text-dnd-parchment">{char.race} {char.class} • Lvl {char.level}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
