"use client";

import { useForm, DefaultValues, SubmitHandler, Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileInput } from "@/components/ui/FileInput";
import * as yup from "yup";
import { ReactNode } from "react";

export interface FieldConfig<T extends Record<string, any>> {
    name: Path<T>;
    type: "text" | "email" | "password" | "date" | "checkbox" | "file";
    label?: string;
    placeholder?: string;
    component?: (props: any) => ReactNode; 
    colSpan?: 1 | 2;
}

interface GenericFormProps<T extends Record<string, any>> {
    schema: yup.ObjectSchema<T>;
    defaultValues?: DefaultValues<T>;
    onSubmit: SubmitHandler<T>;
    fields: FieldConfig<T>[];
    submitText: string;
    loading?: boolean;
    children?: ReactNode;
    globalError?: string | null;
}

export function GenericForm<T extends Record<string, any>>({
    schema,
    defaultValues,
    onSubmit,
    fields,
    submitText,
    loading = false,
    children,
    globalError,
}: GenericFormProps<T>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<T>({
        resolver: yupResolver(schema) as any,
        defaultValues,
    });

    return (
        <div className="w-full">
            {globalError && (
                <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/50">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => {
                        const error = errors[field.name]?.message as string | undefined;
                        return (
                            <div 
                                key={field.name} 
                                className={field.colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}
                            > 
                                {field.component ? (
                                    field.component({ 
                                        ...register(field.name), 
                                        error, 
                                        onChange: (val: any) => setValue(field.name, val), 
                                        value: watch(field.name) 
                                    })
                                ) : field.type === "checkbox" ? (
                                     <div className={`flex items-center h-full ${field.colSpan === 2 ? "" : "pt-6"}`}> 
                                        <Checkbox
                                            label={field.label || ""}
                                            error={error}
                                            {...register(field.name)}
                                        />
                                    </div>
                                ) : field.type === "file" ? (
                                    <div className="flex justify-center mb-6">
                                        <div className="w-full max-w-xs">
                                            <FileInput
                                                label={field.label || ""}
                                                error={error}
                                                onChange={(file) => setValue(field.name, file as any)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        label={field.label || ""}
                                        placeholder={field.placeholder}
                                        error={error}
                                        {...register(field.name)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <Button type="submit" isLoading={loading} className="w-full">
                    {submitText}
                </Button>

                {children}
            </form>
        </div>
    );
}
