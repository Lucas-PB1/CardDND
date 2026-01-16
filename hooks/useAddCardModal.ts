import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { duelService } from "@/services/duelService";
import { storageService } from "@/services/storageService";
import { cardSchema, CardType, MagicLevel, Card } from "@/schemas/duelSchema";
import * as yup from "yup";

interface UseAddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: string;
    deckId: string;
    existingCard?: Card | null;
    onCardAdded: () => void;
}

export function useAddCardModal({
    isOpen,
    onClose,
    characterId,
    deckId,
    existingCard,
    onCardAdded
}: UseAddCardModalProps) {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<CardType>(CardType.Attack);
    const [magicLevel, setMagicLevel] = useState<MagicLevel | "">("");
    const [damage, setDamage] = useState("");
    const [test, setTest] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (existingCard) {
                setName(existingCard.name);
                setDescription(existingCard.description || "");
                setType(existingCard.type as CardType);
                setMagicLevel((existingCard.magicLevel as MagicLevel) || "");
                setDamage(existingCard.damage || "");
                setTest(existingCard.test || "");
                setPreviewUrl(existingCard.imageUrl || null);
                setImageFile(null);
            } else {
                resetForm();
            }
        }
    }, [isOpen, existingCard]);

    const resetForm = () => {
        setName("");
        setDescription("");
        setType(CardType.Attack);
        setMagicLevel("");
        setDamage("");
        setTest("");
        handleRemoveImage();
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClose = () => {
        onClose();
        handleRemoveImage();
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            await cardSchema.validate({
                name,
                description,
                type,
                magicLevel: type === CardType.Magic && magicLevel ? (magicLevel as MagicLevel) : null
            }, { abortEarly: false });

            let imageUrl = "";
            if (imageFile) {
                imageUrl = await storageService.uploadCardImage(user.uid, characterId, deckId, imageFile);
            }

            if (existingCard) {
                await duelService.updateCard(user.uid, characterId, deckId, existingCard.id, {
                    name,
                    description,
                    type,
                    magicLevel: type === CardType.Magic ? (magicLevel as MagicLevel) : null,
                    damage,
                    test,
                    ...(imageUrl ? { imageUrl } : {}),
                });
            } else {
                await duelService.addCard(user.uid, characterId, deckId, {
                    name,
                    description,
                    type,
                    magicLevel: type === CardType.Magic ? (magicLevel as MagicLevel) : null,
                    damage,
                    test,
                    imageUrl,
                });
            }

            onCardAdded();
            handleClose();
        } catch (err: any) {
            console.error(err);
            if (err instanceof yup.ValidationError) {
                setError(err.message);
            } else {
                setError("Failed to add card");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formState: {
            name, setName,
            description, setDescription,
            type, setType,
            magicLevel, setMagicLevel,
            damage, setDamage,
            test, setTest,
            previewUrl,
            loading,
            error
        },
        fileHandling: {
            fileInputRef,
            handleFileChange,
            handleRemoveImage
        },
        handleSubmit,
        handleClose
    };
}
