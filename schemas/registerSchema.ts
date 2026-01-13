import * as yup from "yup";

export const registerSchema = yup.object({
    displayName: yup.string().required("Display name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    birthDate: yup.date().required("Birth date is required").max(new Date(), "Birth date cannot be in the future"),
    hasPlayedBefore: yup.boolean().default(false),
    avatar: yup.mixed<File>()
        .nullable()
        .test("fileSize", "The file is too large (max 5MB)", (value) => {
            if (!value) return true;
            return value.size <= 5000000;
        }),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
