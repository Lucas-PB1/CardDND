import * as yup from "yup";

export const profileSchema = yup.object({
    displayName: yup.string().required("Display name is required"),
    birthDate: yup
        .date()
        .required("Birth date is required")
        .max(new Date(), "Birth date cannot be in the future"),
    hasPlayedBefore: yup.boolean().default(false),
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
    avatar?: File | null;
}
