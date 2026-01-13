"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "@/features/admin/products/services/products.api";
import { adminQueryKeys } from "@/features/admin/constants/queryKeys";
import { toast } from "sonner";

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
            adminProductsApi.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.payments.list({}) });
            toast.success("Cập nhật trạng thái thành công");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
        },
    });
};
