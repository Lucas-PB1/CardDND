import { useState } from "react";

import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { LoginFormData } from "@/schemas/loginSchema";

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            router.push("/");
        } catch (err) {
            const error = err as Error;
            console.error(error);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        error,
        loading,
    };
}
