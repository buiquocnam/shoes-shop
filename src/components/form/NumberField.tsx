"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { BaseFieldProps } from "./types";

/**
 * Custom Number Input Field với Field + Controller
 * Tự động convert value sang number
 */
export const NumberField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    className,
    showLabel = true,
    ...inputProps
}: BaseFieldProps<T> & Omit<React.ComponentProps<typeof Input>, "type"> & { showLabel?: boolean }) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    {label && showLabel && <FieldLabel>{label}</FieldLabel>}
                    <Input
                        type="number"
                        placeholder={placeholder}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        {...inputProps}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};



















