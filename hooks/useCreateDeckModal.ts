import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { duelService } from "@/services/duelService";
import * as yup from "yup";
import { deckSchema, Deck } from "@/schemas/duelSchema";

interface UseCreateDeckModalProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: string;
    existingDeck?: Deck | null;
    onDeckCreated: () => void;
}

export function useCreateDeckModal({
    isOpen,
    onClose,
    characterId,
    existingDeck,
    onDeckCreated
}: UseCreateDeckModalProps) {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (existingDeck) {
                setName(existingDeck.name);
                setDescription(existingDeck.description || "");
            } else {
                setName("");
                setDescription("");
            }
            setError(null);
        }
    }, [isOpen, existingDeck]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            await deckSchema.validate({ name, description }, { abortEarly: false });

            if (existingDeck) {
                await duelService.updateDeck(user.uid, characterId, existingDeck.id, {
                    name,
                    description,
                });
            } else {
                await duelService.createDeck(user.uid, characterId, {
                    name,
                    description,
                });
            }

            onDeckCreated();
            onClose();
            if (!existingDeck) {
                setName("");
                setDescription("");
            }
        } catch (err: any) {
            console.error(err);
            if (err instanceof yup.ValidationError) {
                setError(err.message);
            } else {
                setError("Failed to save deck");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return {
        formState: {
            name, setName,
            description, setDescription,
            loading,
            error
        },
        handleSubmit,
        handleClose
    };
}
