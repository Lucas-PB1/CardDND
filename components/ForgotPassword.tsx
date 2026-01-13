"use client";

import { usePasswordReset } from "@/hooks/usePasswordReset";
import Link from "next/link";
import { GenericForm, FieldConfig } from "./ui/GenericForm";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/schemas/forgotPasswordSchema";

export default function ForgotPassword() {
  const { sendReset, message, error, loading } = usePasswordReset();

  const fields: FieldConfig<ForgotPasswordFormData>[] = [
    { name: "email", type: "email", label: "Email Address", placeholder: "you@example.com", colSpan: 2 },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-sm text-gray-300">Enter your email to receive instructions</p>
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-green-500/20 p-3 text-sm text-green-200 border border-green-500/50">
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
            <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                Back to Login
            </Link>
            </div>
        </GenericForm>
      </div>
    </div>
  );
}
