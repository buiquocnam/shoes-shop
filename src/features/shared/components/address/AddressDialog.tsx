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

export const addressDialogSchema = z.object({
    addressId: z.string().optional(),
    userId: z.string().min(1, { message: "ID người dùng là bắt buộc" }),
    nameReceiver: z.string().min(1, { message: "Tên người nhận là bắt buộc" }),
    phoneReceiver: z.string().min(10, { message: "Số điện thoại không hợp lệ" }).max(11, "Số điện thoại không hợp lệ"),
    provinceCode: z.number().int({ message: "Vui lòng chọn tỉnh/thành phố" }).min(1, "Vui lòng chọn tỉnh/thành phố"),
    provinceName: z.string().min(1, { message: "Tên tỉnh/thành phố là bắt buộc" }),
    districtCode: z.number().int({ message: "Vui lòng chọn quận/huyện" }).min(1, "Vui lòng chọn quận/huyện"),
    districtName: z.string().min(1, { message: "Tên quận/huyện là bắt buộc" }),
    wardCode: z.number().int({ message: "Vui lòng chọn phường/xã" }).min(1, "Vui lòng chọn phường/xã"),
    wardName: z.string().min(1, { message: "Tên phường/xã là bắt buộc" }),
    addressLine: z.string().min(1, { message: "Địa chỉ chi tiết không được để trống" }),
    isDefault: z.boolean(),
});

export type AddressDialogValues = z.infer<typeof addressDialogSchema>;

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
    const isEdit = !!initialData;
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


    // Handle resetting dependent fields logic (same as before but careful not to wipe during edit load)
    useEffect(() => {
        // Only reset if user manually changes province (dirty field)
        // For simplicity, we can rely on standard behavior or add explicit check if form is dirty
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
        // useCreateAddress now calls the shared endpoint which handles both Create and Update (if addressId present)
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
                        {isEdit ? "Cập nhật" : "Thêm"} <span className="text-primary">Địa chỉ</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="p-6 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field data-invalid={!!form.formState.errors.nameReceiver}>
                                    <FieldLabel htmlFor="nameReceiver">Tên người nhận</FieldLabel>
                                    <Input
                                        id="nameReceiver"
                                        placeholder="Nhập tên người nhận"
                                        className="h-11"
                                        {...form.register("nameReceiver")}
                                    />
                                    <FieldError errors={[form.formState.errors.nameReceiver]} />
                                </Field>
                                <Field data-invalid={!!form.formState.errors.phoneReceiver}>
                                    <FieldLabel htmlFor="phoneReceiver">Số điện thoại</FieldLabel>
                                    <Input
                                        id="phoneReceiver"
                                        placeholder="Nhập số điện thoại"
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
                                            <FieldLabel htmlFor="province-select">Tỉnh/Thành phố</FieldLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    handleProvinceChange(value);
                                                }}
                                                value={field.value?.toString() || ""}
                                            >
                                                <SelectTrigger id="province-select" className="h-11">
                                                    <SelectValue placeholder="Chọn" />
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
                                            <FieldLabel htmlFor="district-select">Quận/Huyện</FieldLabel>
                                            <Select
                                                disabled={!provinceCode}
                                                onValueChange={handleDistrictChange}
                                                value={field.value?.toString() || ""}
                                            >
                                                <SelectTrigger id="district-select" className="h-11">
                                                    <SelectValue placeholder="Chọn" />
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
                                            <FieldLabel htmlFor="ward-select">Phường/Xã</FieldLabel>
                                            <Select
                                                disabled={!districtCode}
                                                onValueChange={handleWardChange}
                                                value={field.value?.toString() || ""}
                                            >
                                                <SelectTrigger id="ward-select" className="h-11">
                                                    <SelectValue placeholder="Chọn" />
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
                                <FieldLabel htmlFor="address-line">Địa chỉ chi tiết</FieldLabel>
                                <Input
                                    id="address-line"
                                    placeholder="Số nhà, tên đường, số phòng..."
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
                                                Đặt làm địa chỉ mặc định
                                            </FieldLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Địa chỉ này sẽ được sử dụng mặc định khi thanh toán
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
                                    {createAddressMutation.isPending ? "Đang lưu..." : "Lưu địa chỉ"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
