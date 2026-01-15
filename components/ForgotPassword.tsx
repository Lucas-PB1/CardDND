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
        <div className="flex min-h-screen items-center justify-center bg-dnd-bg p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-dnd-card p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-dnd-fg">Reset Password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to receive instructions
                    </p>
                </div>

                {message && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
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
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-dnd-red hover:text-dnd-crimson hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </GenericForm>
            </div>
        </div>
    );
}
