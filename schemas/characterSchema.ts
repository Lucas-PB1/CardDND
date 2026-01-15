import * as yup from "yup";

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
}

export interface Character extends Omit<CharacterFormData, "image"> {
    id: string;
    userId: string;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}
