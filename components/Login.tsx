"use client";

import { useLogin } from "@/hooks/useLogin";
import Link from "next/link";
import { GenericForm, FieldConfig } from "./ui/GenericForm";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";

export default function Login() {
  const { login, error, loading } = useLogin();

  const fields: FieldConfig<LoginFormData>[] = [
    { name: "email", type: "email", label: "Email Address", placeholder: "you@example.com", colSpan: 2 },
    { name: "password", type: "password", label: "Password", placeholder: "••••••••", colSpan: 2 },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-300">Sign in to your account</p>
        </div>

        <GenericForm
            schema={loginSchema}
            onSubmit={login}
            fields={fields}
            submitText="Sign In"
            loading={loading}
            globalError={error}
        >
            <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                <Link href="/forgot-password" className="hover:text-blue-400 hover:underline">
                Forgot password?
                </Link>
                <Link href="/register" className="hover:text-blue-400 hover:underline">
                Create account
                </Link>
            </div>
        </GenericForm>
      </div>
    </div>
  );
}
