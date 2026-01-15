"use client";

import { ReactNode } from "react";
import {
    Control,
    DefaultValues,
    FieldValues,
    Path,
    Resolver,
    SubmitHandler,
    UseFormRegister,
    useForm,
    UseFormReturn,
    UseFormSetValue,
    Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type CustomComponentProps<T extends FieldValues> = {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error?: string;
    register: UseFormRegister<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
    ref?: React.Ref<any>;
};

export interface FieldConfig<T extends FieldValues> {
    name: Path<T>;
    type: "text" | "email" | "password" | "number" | "date" | "file" | "checkbox" | "select" | "textarea";
    label?: string;
    placeholder?: string;
    component?: (props: CustomComponentProps<T>) => ReactNode;
    colSpan?: 1 | 2;
    options?: { label: string; value: string | number }[];
    disabled?: boolean;
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
    form?: UseFormReturn<T>;
}

function FormFieldItem<T extends FieldValues>({
    field,
    register,
    error,
    control,
}: {
    field: FieldConfig<T>;
    register: UseFormRegister<T>;
    setValue: UseFormSetValue<T>;
    control: Control<T>;
    error?: string;
}) {
    if (field.component) {
        const isStatic = field.name.toString().startsWith("header_");

        if (isStatic) {
            return <>{field.component({
                value: undefined,
                onChange: () => { },
                onBlur: () => { },
                error: undefined,
                register,
                name: field.name,
                label: field.label,
                placeholder: field.placeholder,
            })}</>;
        }

        return (
            <Controller
                control={control}
                name={field.name}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                    <>
                        {field.component!({
                            value,
                            onChange,
                            onBlur,
                            error,
                            register,
                            name: field.name,
                            label: field.label,
                            placeholder: field.placeholder,
                            ref,
                        })}
                    </>
                )}
            />
        );
    }

    if (field.type === "checkbox") {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={field.name}
                    {...register(field.name)}
                    className="h-4 w-4 rounded border-border bg-input text-dnd-red focus:ring-ring"
                />
                <label htmlFor={field.name} className="text-sm font-medium text-muted-foreground">
                    {field.label}
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        );
    }

    return (
        <Input
            id={field.name}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            error={error}
            disabled={field.disabled}
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
    form,
}: GenericFormProps<T>) {
    const internalForm = useForm<T>({
        resolver: yupResolver(schema) as unknown as Resolver<T>,
        defaultValues,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
    } = form || internalForm;

    return (
        <div className="w-full">
            {globalError && (
                <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
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

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" isLoading={loading} className="w-full flex-1">
                        {submitText}
                    </Button>

                    {children && <div className="w-full flex-1">{children}</div>}
                </div>
            </form>
        </div>
    );
}
