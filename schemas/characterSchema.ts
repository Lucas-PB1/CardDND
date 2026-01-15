import * as yup from "yup";
import { AbilityScore, Skill } from "@/lib/characterConstants";

const statsSchema = Object.values(AbilityScore).reduce((acc, ability) => {
    acc[ability] = yup.number().default(10);
    return acc;
}, {} as Record<string, any>);

const savingThrowsSchema = Object.values(AbilityScore).reduce((acc, ability) => {
    acc[ability] = yup.number().default(0);
    return acc;
}, {} as Record<string, any>);

const skillsSchema = Object.values(Skill).reduce((acc, skill) => {
    acc[skill] = yup.number().default(0);
    return acc;
}, {} as Record<string, any>);

export const characterSchema = yup.object({
    name: yup.string().required("Character name is required"),
    level: yup
        .number()
        .typeError("Level must be a number")
        .min(1, "Level must be at least 1")
        .max(20, "Level cannot exceed 20")
        .required("Level is required"),
    class: yup.string().required("Class is required"),
    subclass: yup.string().nullable(),
    gold: yup.number().typeError("Gold must be a number").min(0).default(0),
    experience: yup.number().typeError("XP must be a number").min(0).default(0),
    dndBeyondUrl: yup
        .string()
        .url("Must be a valid URL")
        .matches(
            /^https?:\/\/(www\.)?dndbeyond\.com\/characters\/\d+$/,
            "Must be a valid D&D Beyond character sheet URL"
        )
        .nullable(),
    image: yup
        .mixed<File>()
        .nullable()
        .test("fileSize", "The file is too large (max 5MB)", (value) => {
            if (!value) return true;
            return value.size <= 5000000;
        }),
    race: yup.string().nullable(),
    stats: yup.object(statsSchema),
    savingThrows: yup.object(savingThrowsSchema),
    hp: yup.object({
        current: yup.number().default(0),
        max: yup.number().default(0),
        temp: yup.number().default(0),
    }),
    speed: yup.number().nullable(),
    proficiencyBonus: yup.number().nullable(),
    initiative: yup.number().nullable(),
    armorClass: yup.number().nullable(),
    skills: yup.object(skillsSchema),
});

export interface CharacterFormData {
    name: string;
    level: number;
    class: string;
    subclass?: string | null;
    gold?: number;
    experience?: number;
    dndBeyondUrl?: string | null;
    image?: File | null;
    race?: string | null;
    stats?: Record<AbilityScore, number>;
    savingThrows?: Record<AbilityScore, number>;
    skills?: Record<Skill, number>;
    hp?: {
        current: number;
        max: number;
        temp: number;
    };
    speed?: number | null;
    proficiencyBonus?: number | null;
    initiative?: number | null;
    armorClass?: number | null;
}

export interface Character extends Omit<CharacterFormData, "image"> {
    id: string;
    userId: string;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}
