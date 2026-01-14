import { useState } from "react";

import { useRouter } from "next/navigation";

import {
    createUserWithEmailAndPassword,
    getIdToken,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { RegisterFormData } from "@/schemas/registerSchema";
import { storageService } from "@/services/storageService";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    const registerUser = async (data: RegisterFormData) => {
        setLoading(true);
        setGlobalError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );
            const user = userCredential.user;

            let photoURL = "";
            if (data.avatar) {
                try {
                    photoURL = await storageService.uploadAvatar(user.uid, data.avatar);
                } catch (imgError) {
                    console.error("Avatar upload failed, continuing without it.", imgError);
                }
            }

            await updateProfile(user, {
                displayName: data.displayName,
                photoURL: photoURL || null,
            });

            await sendEmailVerification(user);

            const token = await getIdToken(user);

            const syncPayload = {
                displayName: data.displayName,
                photoURL: photoURL || null,
                birthDate: data.birthDate.toISOString(),
                hasPlayedBefore: data.hasPlayedBefore,
            };

            const response = await fetch("/api/auth/sync", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(syncPayload),
            });

            if (!response.ok) {
                throw new Error("Failed to sync user data");
            }

            router.push("/");
        } catch (err) {
            const error = err as Error & { code?: string };
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                setGlobalError("This email is already registered.");
            } else {
                setGlobalError("Failed to register. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        registerUser,
        loading,
        globalError,
    };
}
