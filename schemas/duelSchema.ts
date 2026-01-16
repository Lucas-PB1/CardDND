import * as yup from "yup";

export enum CardType {
    Attack = "Attack",
    Magic = "Magic",
    RaceAbility = "Race Ability",
    ClassAbility = "Class Ability",
}

export enum MagicLevel {
    Cantrip = "Cantrip",
    Level1 = "Level 1",
    Level2 = "Level 2",
    Level3 = "Level 3",
    Level4 = "Level 4",
    Level5 = "Level 5",
    Level6 = "Level 6",
    Level7 = "Level 7",
    Level8 = "Level 8",
    Level9 = "Level 9",
}

export const cardSchema = yup.object({
    name: yup.string().required("Card name is required"),
    description: yup.string().optional(),
    imageUrl: yup.string().url("Must be a valid URL").optional(),
    type: yup.string().oneOf(Object.values(CardType)).required("Card type is required"),
    magicLevel: yup.string().oneOf(Object.values(MagicLevel)).optional().nullable(),
    damage: yup.string().optional(),
    test: yup.string().optional(),
});

export const deckSchema = yup.object({
    name: yup.string().required("Deck name is required"),
    description: yup.string().optional(),
    maxCards: yup.number().min(1).default(60), // Optional limit
});

export interface Card extends yup.InferType<typeof cardSchema> {
    id: string;
    deckId: string;
    characterId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Deck extends yup.InferType<typeof deckSchema> {
    id: string;
    characterId: string;
    userId: string;
    cardCount?: number; // Helper field for display
    createdAt: string;
    updatedAt: string;
}
