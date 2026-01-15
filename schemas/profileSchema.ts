import * as yup from "yup";

export const profileSchema = yup.object({
    displayName: yup.string().required("Display name is required"),
    birthDate: yup
        .date()
        .required("Birth date is required")
        .max(new Date(), "Birth date cannot be in the future"),
    hasPlayedBefore: yup.boolean().default(false),
    dndBeyondProfileUrl: yup
        .string()
        .url("Must be a valid URL")
        .matches(
            /^https?:\/\/(www\.)?dndbeyond\.com\/characters\/\d+$/,
            "Must be a valid D&D Beyond character sheet URL (e.g. https://www.dndbeyond.com/characters/123456)",
        )
        .nullable(),
    avatar: yup
        .mixed<File>()
        .nullable()
        .test("fileSize", "The file is too large (max 5MB)", (value) => {
            if (!value) return true;
            return value.size <= 5000000;
        }),
});

export interface ProfileFormData {
    displayName: string;
    birthDate: Date | string;
    hasPlayedBefore: boolean;
    dndBeyondProfileUrl?: string | null;
    avatar?: File | null;
}
