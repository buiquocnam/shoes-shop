"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface NumberInputProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    placeholder: string;
    label?: string;
    className?: string;
    min?: number;
    max?: number;
}

/**
 * Shared NumberInput component for product forms
 */
export const NumberInput = <T extends FieldValues>({
    control,
    name,
    placeholder,
    label,
    className,
    min,
    max,
}: NumberInputProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={className}>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input
                        type="number"
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

interface SelectFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    options: Array<{ id: string; name: string }>;
    placeholder?: string;
    className?: string;
}

/**
 * Shared SelectField component for product forms
 */
export const SelectField = <T extends FieldValues>({
    control,
    name,
    label,
    options,
    placeholder = "Select an option",
    className,
}: SelectFieldProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={className}>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <select
                        {...field}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    >
                        <option value="">{placeholder}</option>
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

