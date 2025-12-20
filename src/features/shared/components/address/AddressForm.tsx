"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputField, CustomField, SelectField } from "@/components/form";
import {
    useProvinces,
    useDistricts,
    useWards,
    useCreateAddress,
} from "@/features/shared/hooks/useAdress";

export const addressFormSchema = z.object({
    userId: z.string().min(1, { message: "ID người dùng là bắt buộc" }),
    provinceCode: z.number().int({ message: "Vui lòng chọn tỉnh/thành phố" }).min(1, "Vui lòng chọn tỉnh/thành phố"),
    provinceName: z.string().min(1, { message: "Tên tỉnh/thành phố là bắt buộc" }),
    districtCode: z.number().int({ message: "Vui lòng chọn quận/huyện" }).min(1, "Vui lòng chọn quận/huyện"),
    districtName: z.string().min(1, { message: "Tên quận/huyện là bắt buộc" }),
    wardCode: z.number().int({ message: "Vui lòng chọn phường/xã" }).min(1, "Vui lòng chọn phường/xã"),
    wardName: z.string().min(1, { message: "Tên phường/xã là bắt buộc" }),
    addressLine: z.string().min(1, { message: "Địa chỉ chi tiết không được để trống" }),
    isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormProps {
    userId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

/**
 * Component form để thêm địa chỉ mới
 * Dùng chung cho cả profile và checkout
 */
export function AddressForm({ userId, onSuccess, onCancel }: AddressFormProps) {
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            userId,
            provinceCode: 0,
            provinceName: "",
            districtCode: 0,
            districtName: "",
            wardCode: 0,
            wardName: "",
            addressLine: "",
            isDefault: false,
        },
    });

    const provinceCode = form.watch("provinceCode");
    const districtCode = form.watch("districtCode");

    const { data: provinces } = useProvinces();
    const { data: districts } = useDistricts(provinceCode);
    const { data: wards } = useWards(districtCode);
    const createAddressMutation = useCreateAddress(userId);

    // Reset district and ward when province changes
    useEffect(() => {
        if (provinceCode) {
            form.setValue("districtCode", 0);
            form.setValue("districtName", "");
            form.setValue("wardCode", 0);
            form.setValue("wardName", "");
        }
    }, [provinceCode, form]);

    // Reset ward when district changes
    useEffect(() => {
        if (districtCode) {
            form.setValue("wardCode", 0);
            form.setValue("wardName", "");
        }
    }, [districtCode, form]);

    const handleProvinceChange = (provinceCodeStr: string) => {
        const code = Number(provinceCodeStr);
        const province = provinces?.find((p) => p.code === code);
        if (province) {
            form.setValue("provinceCode", code);
            form.setValue("provinceName", province.name);
        }
    };

    const handleDistrictChange = (districtCodeStr: string) => {
        const code = Number(districtCodeStr);
        const district = districts?.find((d) => d.code === code);
        if (district) {
            form.setValue("districtCode", code);
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

    const onSubmit = async (data: AddressFormValues) => {
        await createAddressMutation.mutateAsync(data);
        form.reset();
        onSuccess?.();
    };

    // Convert data to SelectField format
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectField
                    control={form.control}
                    name="provinceCode"
                    label="Tỉnh/Thành phố"
                    options={provinceOptions}
                    placeholder="Chọn tỉnh/thành phố"
                    onValueChange={(value) => {
                        const code = Number(value) || 0;
                        form.setValue("provinceCode", code);
                        handleProvinceChange(value);
                    }}
                />

                <SelectField
                    control={form.control}
                    name="districtCode"
                    label="Quận/Huyện"
                    options={districtOptions}
                    placeholder="Chọn quận/huyện"
                    disabled={!provinceCode}
                    onValueChange={(value) => {
                        const code = Number(value) || 0;
                        form.setValue("districtCode", code);
                        handleDistrictChange(value);
                    }}
                />

                <SelectField
                    control={form.control}
                    name="wardCode"
                    label="Phường/Xã"
                    options={wardOptions}
                    placeholder="Chọn phường/xã"
                    disabled={!districtCode}
                    onValueChange={(value) => {
                        const code = Number(value) || 0;
                        form.setValue("wardCode", code);
                        handleWardChange(value);
                    }}
                />
            </div>

            <InputField
                control={form.control}
                name="addressLine"
                label="Địa chỉ chi tiết"
                placeholder="Số nhà, tên đường, số phòng..."
            />

            <CustomField
                control={form.control}
                name="isDefault"
                className="rounded-md border border-gray-200 p-4 bg-gray-50/50"
                render={(field, fieldState) => (
                    <div className="flex flex-row items-center space-x-3 space-y-0">
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <div className="space-y-1 leading-none">
                            <label className="font-normal cursor-pointer text-sm">
                                Đặt làm địa chỉ mặc định
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Địa chỉ này sẽ được sử dụng mặc định khi thanh toán
                            </p>
                        </div>
                    </div>
                )}
            />

            <div className="flex gap-3 pt-2">
                <Button
                    type="submit"
                    disabled={createAddressMutation.isPending}
                    className="flex-1 gap-2"
                >
                    {createAddressMutation.isPending ? (
                        <>
                            <span className="animate-spin">⏳</span>
                            Đang thêm...
                        </>
                    ) : (
                        "Thêm địa chỉ"
                    )}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={createAddressMutation.isPending}
                        className="px-6"
                    >
                        Hủy
                    </Button>
                )}
            </div>
        </form>
    );
}

