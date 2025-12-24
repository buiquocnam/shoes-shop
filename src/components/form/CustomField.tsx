"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { BaseFieldProps } from "./types";
import { ReactNode } from "react";

/**
 * Custom Field với render prop để tùy chỉnh
 */
export const CustomField = <T extends FieldValues>({
    control,
    name,
    label,
    className,
    labelClassName,
    render,
}: BaseFieldProps<T> & {
    labelClassName?: string;
    render: (field: { value: any; onChange: (value: any) => void }, fieldState: { invalid: boolean; error?: any }) => ReactNode;
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    {label && <FieldLabel className={labelClassName}>{label}</FieldLabel>}
                    {render(field, fieldState)}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};


