"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { BaseFieldProps } from "./types";

/**
 * Custom Input Field với Field + Controller
 */
export const InputField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    className,
    ...inputProps
}: BaseFieldProps<T> & React.ComponentProps<typeof Input>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    {label && <FieldLabel>{label}</FieldLabel>}
                    <Input placeholder={placeholder} {...field} {...inputProps} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};



















