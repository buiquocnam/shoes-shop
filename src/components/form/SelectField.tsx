"use client";

import { Controller, FieldValues } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldLabel, FieldContent } from "@/components/ui/field";
import { BaseFieldProps } from "./types";

export interface SelectOption {
    id: string;
    name: string;
}

/**
 * Custom Select Field với Field + Controller
 */
export const SelectField = <T extends FieldValues>({
    control,
    name,
    label,
    options,
    placeholder = "Chọn một tùy chọn",
    className,
}: BaseFieldProps<T> & {
    options: SelectOption[];
    placeholder?: string;
}) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    {label && <FieldLabel>{label}</FieldLabel>}
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );
};
























