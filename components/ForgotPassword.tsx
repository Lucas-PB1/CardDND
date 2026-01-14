"use client";

import Link from "next/link";

import { usePasswordReset } from "@/hooks/usePasswordReset";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";

import { FieldConfig, GenericForm } from "./ui/GenericForm";

export default function ForgotPassword() {
    const { sendReset, message, error, loading } = usePasswordReset();

    const fields: FieldConfig<ForgotPasswordFormData>[] = [
        {
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "you@example.com",
            colSpan: 2,
        },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-sm text-gray-300">
                        Enter your email to receive instructions
                    </p>
                </div>

                {message && (
                    <div className="mb-4 rounded-lg border border-green-500/50 bg-green-500/20 p-3 text-sm text-green-200">
                        {message}
                    </div>
                )}

                <GenericForm
                    schema={forgotPasswordSchema}
                    onSubmit={sendReset}
                    fields={fields}
                    submitText="Send Reset Link"
                    loading={loading}
                    globalError={error}
                >
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </GenericForm>
            </div>
        </div>
    );
}
