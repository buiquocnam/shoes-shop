import { apiClient } from "@/lib/api";
import { ProductVariantHistory, ProductVariantHistoryResponse } from "../types";

export const adminVariantsApi = {
    getAll: async (): Promise<ProductVariantHistoryResponse> => {
        const response = await apiClient.get<ProductVariantHistoryResponse>(`/shoes/variants/history`);
        return response.result;
    },
};
