"use client";
import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import { GenericForm, FieldConfig } from "./ui/GenericForm";
import { registerSchema, RegisterFormData } from "@/schemas/registerSchema";

export default function Register() {
  const { registerUser, loading, globalError } = useRegister();

  const fields: FieldConfig<RegisterFormData>[] = [
    {
      name: "avatar",
      type: "file",
      label: "Profile Picture",
      colSpan: 2,
    },
    { name: "displayName", type: "text", label: "Display Name", placeholder: "Gandalf the Grey", colSpan: 2 },
    { name: "email", type: "email", label: "Email Address", placeholder: "you@example.com" },
    { 
        name: "birthDate", 
        type: "date", 
        label: "Date of Birth",
    },
    { name: "password", type: "password", label: "Password", placeholder: "••••••••" },
    { name: "confirmPassword", type: "password", label: "Confirm Password", placeholder: "••••••••" },
    {
      name: "hasPlayedBefore",
      type: "checkbox",
      label: "I have played D&D before",
      colSpan: 2,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md border border-white/20">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-sm text-gray-300">Join the adventure today</p>
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
            <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                Sign in
            </Link>
            </div>
        </GenericForm>
      </div>
    </div>
  );
}
