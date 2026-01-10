"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
    useProvinces,
    useDistricts,
    useWards,
    useCreateAddress,
} from "@/features/shared/hooks/useAdress";
import { AddressType } from "@/types/address";
import { useTranslations } from "next-intl";

const getAddressSchema = (t: any) => z.object({
    addressId: z.string().optional(),
    userId: z.string().min(1, { message: t('validation.required', { field: 'ID' }) }),
    nameReceiver: z.string().min(1, { message: t('validation.required', { field: t('receiver') }) }),
    phoneReceiver: z.string().min(10, { message: t('validation.invalidPhone') }).max(11, t('validation.invalidPhone')),
    provinceCode: z.number().int({ message: t('validation.selectProvince') }).min(1, t('validation.selectProvince')),
    provinceName: z.string().min(1, { message: t('validation.required', { field: t('province') }) }),
    districtCode: z.number().int({ message: t('validation.selectDistrict') }).min(1, t('validation.selectDistrict')),
    districtName: z.string().min(1, { message: t('validation.required', { field: t('district') }) }),
    wardCode: z.number().int({ message: t('validation.selectWard') }).min(1, t('validation.selectWard')),
    wardName: z.string().min(1, { message: t('validation.required', { field: t('ward') }) }),
    addressLine: z.string().min(1, { message: t('validation.detailEmpty') }),
    isDefault: z.boolean(),
});

export type AddressDialogValues = {
    addressId?: string;
    userId: string;
    nameReceiver: string;
    phoneReceiver: string;
    provinceCode: number;
    provinceName: string;
    districtCode: number;
    districtName: string;
    wardCode: number;
    wardName: string;
    addressLine: string;
    isDefault: boolean;
};

interface AddressDialogProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultIsDefault?: boolean;
    initialData?: AddressType | null;
}

export function AddressDialog({
    userId,
    open,
    onOpenChange,
    defaultIsDefault = false,
    initialData,
}: AddressDialogProps) {
    const t = useTranslations('Address');
    const tCommon = useTranslations('Common');
    const isEdit = !!initialData;

    const addressDialogSchema = getAddressSchema(t);

    const form = useForm<AddressDialogValues>({
        resolver: zodResolver(addressDialogSchema),
        defaultValues: {
            userId,
            nameReceiver: "",
            phoneReceiver: "",
            provinceCode: 0,
            provinceName: "",
            districtCode: 0,
            districtName: "",
            wardCode: 0,
            wardName: "",
            addressLine: "",
            isDefault: defaultIsDefault,
        },
    });

    const provinceCode = form.watch("provinceCode");
    const districtCode = form.watch("districtCode");

    const { data: provinces } = useProvinces();
    const { data: districts } = useDistricts(provinceCode);
    const { data: wards } = useWards(districtCode);
    const createAddressMutation = useCreateAddress(userId);

    // Populate form when initialData changes or dialog opens
    useEffect(() => {
        if (open && initialData) {
            form.reset({
                addressId: initialData.id,
                userId: initialData.userId,
                nameReceiver: initialData.nameReceiver || "",
                phoneReceiver: initialData.phoneReceiver || "",
                provinceCode: initialData.provinceCode,
                provinceName: initialData.provinceName,
                districtCode: initialData.districtCode,
                districtName: initialData.districtName,
                wardCode: initialData.wardCode,
                wardName: initialData.wardName,
                addressLine: initialData.addressLine,
                isDefault: initialData.isDefault,
            });
        } else if (open && !initialData) {
            form.reset({
                userId,
                nameReceiver: "",
                phoneReceiver: "",
                provinceCode: 0,
                provinceName: "",
                districtCode: 0,
                districtName: "",
                wardCode: 0,
                wardName: "",
                addressLine: "",
                isDefault: defaultIsDefault,
            });
        }
    }, [open, initialData, userId, defaultIsDefault, form]);


    // Handle resetting dependent fields logic
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            if (name === 'provinceCode' && type === 'change') {
                form.setValue("districtCode", 0);
                form.setValue("districtName", "");
                form.setValue("wardCode", 0);
                form.setValue("wardName", "");
            }
            if (name === 'districtCode' && type === 'change') {
                form.setValue("wardCode", 0);
                form.setValue("wardName", "");
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);


    const handleProvinceChange = (provinceCodeStr: string) => {
        const code = Number(provinceCodeStr);
        const province = provinces?.find((p) => p.code === code);
        if (province) {
            form.setValue("provinceCode", code, { shouldDirty: true });
            form.setValue("provinceName", province.name);
        }
    };

    const handleDistrictChange = (districtCodeStr: string) => {
        const code = Number(districtCodeStr);
        const district = districts?.find((d) => d.code === code);
        if (district) {
            form.setValue("districtCode", code, { shouldDirty: true });
            form.setValue("districtName", district.name);
        }
    };

    const handleWardChange = (wardCodeStr: string) => {
        const code = Number(wardCodeStr);
        const ward = wards?.find((w) => w.code === code);
        if (ward) {
            form.setValue("wardCode", code);
            form.setValue("wardName", ward.name);
        }
    };

    const onSubmit = async (data: AddressDialogValues) => {
        await createAddressMutation.mutateAsync(data);
        form.reset();
        onOpenChange(false);
    };

    const provinceOptions = provinces?.map((p) => ({
        id: p.code.toString(),
        name: p.name,
    })) || [];

    const districtOptions = districts?.map((d) => ({
        id: d.code.toString(),
        name: d.name,
    })) || [];

    const wardOptions = wards?.map((w) => ({
        id: w.code.toString(),
        name: w.name,
    })) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
                <DialogHeader className="p-6 border-b bg-muted/30 flex-shrink-0">
                    <DialogTitle className="text-xl font-bold uppercase tracking-tight">
                        {isEdit ? t('title.edit') : t('title.add')}
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="p-6 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field data-invalid={!!form.formState.errors.nameReceiver}>
                                    <FieldLabel htmlFor="nameReceiver">{t('receiver')}</FieldLabel>
                                    <Input
                                        id="nameReceiver"
                                        placeholder={t('receiverPlaceholder')}
                                        className="h-11"
                                        {...form.register("nameReceiver")}
                                    />
                                    <FieldError errors={[form.formState.errors.nameReceiver]} />
                                </Field>
                                <Field data-invalid={!!form.formState.errors.phoneReceiver}>
                                    <FieldLabel htmlFor="phoneReceiver">{t('phone')}</FieldLabel>
                                    <Input
                                        id="phoneReceiver"
                                        placeholder={t('phonePlaceholder')}
                                        className="h-11"
                                        {...form.register("phoneReceiver")}
                                    />
                                    <FieldError errors={[form.formState.errors.phoneReceiver]} />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Controller
                                    control={form.control}
                                    name="provinceCode"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="province-select">{t('province')}</FieldLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    handleProvinceChange(value);
                                                }}
                                                value={field.value?.toString() || ""}
                                            >
                                                <SelectTrigger id="province-select" className="h-11">
                                                    <SelectValue placeholder={t('select')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {provinceOptions.map((option) => (
                                                        <SelectItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="districtCode"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="district-select">{t('district')}</FieldLabel>
                                            <Select
                                                disabled={!provinceCode}
                                                onValueChange={handleDistrictChange}
                                                value={field.value?.toString() || ""}
                                            >
                                                <SelectTrigger id="district-select" className="h-11">
                                                    <SelectValue placeholder={t('select')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {districtOptions.map((option) => (
                                                        <SelectItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="wardCode"
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="ward-select">{t('ward')}</FieldLabel>
                                            <Select
                                                disabled={!districtCode}
                                                onValueChange={handleWardChange}
                                                value={field.value?.toString() || ""}
                                            >
                                                <SelectTrigger id="ward-select" className="h-11">
                                                    <SelectValue placeholder={t('select')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wardOptions.map((option) => (
                                                        <SelectItem key={option.id} value={option.id}>
                                                            {option.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError errors={[fieldState.error]} />
                                        </Field>
                                    )}
                                />
                            </div>

                            <Field data-invalid={!!form.formState.errors.addressLine}>
                                <FieldLabel htmlFor="address-line">{t('detail')}</FieldLabel>
                                <Input
                                    id="address-line"
                                    placeholder={t('detailPlaceholder')}
                                    className="h-11"
                                    {...form.register("addressLine")}
                                />
                                <FieldError errors={[form.formState.errors.addressLine]} />
                            </Field>

                            <Controller
                                control={form.control}
                                name="isDefault"
                                render={({ field, fieldState }) => (
                                    <Field className="rounded-lg border p-4 bg-muted/20" data-invalid={fieldState.invalid} orientation="horizontal">
                                        <Checkbox
                                            id="address-default"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FieldContent>
                                            <FieldLabel htmlFor="address-default" className="font-bold cursor-pointer">
                                                {t('default')}
                                            </FieldLabel>
                                            <p className="text-xs text-muted-foreground">
                                                {t('defaultDescription')}
                                            </p>
                                        </FieldContent>
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <div className="pt-2">
                                <Button
                                    disabled={createAddressMutation.isPending}
                                    className="w-full h-12 font-bold uppercase tracking-wide"
                                >
                                    {createAddressMutation.isPending ? <Spinner className="h-4 w-4 mr-2" /> : null}
                                    {createAddressMutation.isPending ? t('saving') : t('save')}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
