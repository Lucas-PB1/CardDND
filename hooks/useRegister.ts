import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, getIdToken, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { RegisterFormData } from "@/schemas/registerSchema";
import { uploadAvatar } from "@/services/storageService";

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    const registerUser = async (data: RegisterFormData) => {
        setLoading(true);
        setGlobalError(null);

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // 2. Upload Avatar (if exists)
            let photoURL = "";
            if (data.avatar) {
                try {
                    photoURL = await uploadAvatar(user.uid, data.avatar);
                } catch (imgError) {
                    console.error("Avatar upload failed, continuing without it.", imgError);
                }
            }

            // 3. Update Auth Profile
            await updateProfile(user, {
                displayName: data.displayName,
                photoURL: photoURL || null,
            });

            // 4. Send Verification Email
            await sendEmailVerification(user);

            // 5. Sync with Backend (Firestore)
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
        } catch (err: any) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
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
