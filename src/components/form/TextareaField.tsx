"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { BaseFieldProps } from "./types";

/**
 * Custom Textarea Field với Field + Controller
 */
export const TextareaField = <T extends FieldValues>({
    control,
    name,
    label,
    className,
    height,
    ...textareaProps
}: BaseFieldProps<T> & React.ComponentProps<typeof Textarea> & { height?: string }) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    {label && <FieldLabel>{label}</FieldLabel>}
                    <Textarea {...field} {...textareaProps} style={{ height: height }} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};












