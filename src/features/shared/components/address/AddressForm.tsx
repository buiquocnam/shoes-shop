"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="provinceCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                        field.onChange(Number(e.target.value) || 0);
                                        handleProvinceChange(e.target.value);
                                    }}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces?.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="districtCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                        field.onChange(Number(e.target.value) || 0);
                                        handleDistrictChange(e.target.value);
                                    }}
                                    disabled={!provinceCode}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts?.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="wardCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phường/Xã</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                        field.onChange(Number(e.target.value) || 0);
                                        handleWardChange(e.target.value);
                                    }}
                                    disabled={!districtCode}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {wards?.map((ward) => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="addressLine"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Địa chỉ chi tiết</FormLabel>
                            <FormControl>
                                <Input placeholder="Số nhà, tên đường..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Đặt làm địa chỉ mặc định</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <Button type="submit" disabled={createAddressMutation.isPending} className="flex-1">
                        {createAddressMutation.isPending ? "Đang thêm..." : "Thêm địa chỉ"}
                    </Button>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={createAddressMutation.isPending}
                        >
                            Hủy
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}

