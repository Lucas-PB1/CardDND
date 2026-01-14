import { useState } from "react";

import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { ForgotPasswordFormData } from "@/schemas/forgotPasswordSchema";

export function usePasswordReset() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const sendReset = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            await sendPasswordResetEmail(auth, data.email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err) {
            const error = err as Error & { code?: string };
            console.error(error);
            if (error.code === "auth/user-not-found") {
                setError("No user found with this email.");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        sendReset,
        message,
        error,
        loading,
    };
}
