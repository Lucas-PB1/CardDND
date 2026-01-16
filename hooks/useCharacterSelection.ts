import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { characterClient } from "@/services/characterClientService";
import { Character } from "@/schemas/characterSchema";

export function useCharacterSelection() {
    const { user } = useAuth();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            characterClient.getCharacters().then((chars) => {
                setCharacters(chars);
                setLoading(false);
            });
        }
    }, [user]);

    return {
        user,
        characters,
        loading
    };
}
