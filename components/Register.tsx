"use client";
import Link from "next/link";

import { useRegister } from "@/hooks/useRegister";
import { RegisterFormData, registerSchema } from "@/schemas/registerSchema";

import { FieldConfig, GenericForm } from "./ui/GenericForm";

export default function Register() {
    const { registerUser, loading, globalError } = useRegister();

    const fields: FieldConfig<RegisterFormData>[] = [
        {
            name: "avatar",
            type: "file",
            label: "Profile Picture",
            colSpan: 2,
        },
        {
            name: "displayName",
            type: "text",
            label: "Display Name",
            placeholder: "Gandalf the Grey",
            colSpan: 2,
        },
        { name: "email", type: "email", label: "Email Address", placeholder: "you@example.com" },
        {
            name: "birthDate",
            type: "date",
            label: "Date of Birth",
        },
        { name: "password", type: "password", label: "Password", placeholder: "••••••••" },
        {
            name: "confirmPassword",
            type: "password",
            label: "Confirm Password",
            placeholder: "••••••••",
        },
        {
            name: "hasPlayedBefore",
            type: "checkbox",
            label: "I have played D&D before",
            colSpan: 2,
        },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-dnd-bg p-4 py-12">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-dnd-card p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-dnd-fg">Create Account</h1>
                    <p className="text-sm text-muted-foreground">Join the adventure today</p>
                </div>

                <GenericForm
                    schema={registerSchema}
                    onSubmit={registerUser}
                    fields={fields}
                    submitText="Create Account"
                    loading={loading}
                    globalError={globalError}
                    defaultValues={{ hasPlayedBefore: false }}
                >
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-dnd-red hover:text-dnd-crimson hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </GenericForm>
            </div>
        </div>
    );
}
