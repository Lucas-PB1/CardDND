"use client";

import { ReactNode } from "react";
import {
    Control,
    DefaultValues,
    FieldValues,
    Path,
    PathValue,
    Resolver,
    SubmitHandler,
    UseFormRegister,
    UseFormRegisterReturn,
    UseFormSetValue,
    useForm,
    useWatch,
} from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileInput } from "@/components/ui/FileInput";
import { Input } from "@/components/ui/Input";

export interface CustomComponentProps<T extends FieldValues> {
    onChange: (value: PathValue<T, Path<T>>) => void;
    onBlur: UseFormRegisterReturn["onBlur"];
    value: PathValue<T, Path<T>>;
    name: Path<T>;
    ref: UseFormRegisterReturn["ref"];
    error?: string;
}

export interface FieldConfig<T extends FieldValues> {
    name: Path<T>;
    type: "text" | "email" | "password" | "date" | "checkbox" | "file";
    label?: string;
    placeholder?: string;
    component?: (props: CustomComponentProps<T>) => ReactNode;
    colSpan?: 1 | 2;
}

interface GenericFormProps<T extends FieldValues> {
    schema: yup.ObjectSchema<T>;
    defaultValues?: DefaultValues<T>;
    onSubmit: SubmitHandler<T>;
    fields: FieldConfig<T>[];
    submitText: string;
    loading?: boolean;
    children?: ReactNode;
    globalError?: string | null;
}

/**
 * A sub-component to handle individual field rendering with useWatch.
 * This is isolated to prevent the entire form from re-rendering
 * when a single field being "watched" changes.
 */
function FormFieldItem<T extends FieldValues>({
    field,
    register,
    setValue,
    control,
    error,
}: {
    field: FieldConfig<T>;
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    control: Control<T>;
    error?: string;
}) {
    const value = useWatch({
        control,
        name: field.name,
    });

    if (field.component) {
        const registration = register(field.name);
        return field.component({
            ...registration,
            error,
            onChange: (val: PathValue<T, Path<T>>) => setValue(field.name, val),
            value: value as PathValue<T, Path<T>>,
        });
    }

    if (field.type === "checkbox") {
        return (
            <div className={`flex h-full items-center ${field.colSpan === 2 ? "" : "pt-6"}`}>
                <Checkbox label={field.label || ""} error={error} {...register(field.name)} />
            </div>
        );
    }

    if (field.type === "file") {
        return (
            <div className="mb-6 flex justify-center">
                <div className="w-full max-w-xs">
                    <FileInput
                        label={field.label || ""}
                        error={error}
                        onChange={(file) => setValue(field.name, file as PathValue<T, Path<T>>)}
                    />
                </div>
            </div>
        );
    }

    return (
        <Input
            id={field.name}
            type={field.type}
            label={field.label || ""}
            placeholder={field.placeholder}
            error={error}
            {...register(field.name)}
        />
    );
}

export function GenericForm<T extends FieldValues>({
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
        control,
    } = useForm<T>({
        resolver: yupResolver(schema) as Resolver<T>,
        defaultValues,
    });

    return (
        <div className="w-full">
            {globalError && (
                <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-3 text-sm text-red-200">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {fields.map((field) => {
                        const error = errors[field.name]?.message as string | undefined;
                        return (
                            <div
                                key={field.name}
                                className={
                                    field.colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"
                                }
                            >
                                <FormFieldItem<T>
                                    field={field}
                                    register={register}
                                    setValue={setValue}
                                    control={control}
                                    error={error}
                                />
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
