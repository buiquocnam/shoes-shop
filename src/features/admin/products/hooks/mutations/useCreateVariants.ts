import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../../services/products.api";
import { CreateVariantsInput } from "../../types";
import { queryKeys } from "@/features/shared";

/**
 * Hook để tạo variants mới cho product
 */
export const useCreateVariants = () => {
  const queryClient = useQueryClient();

  return useMutation<Array<{ id: string }>, Error, CreateVariantsInput>({
    mutationFn: (data: CreateVariantsInput) =>
      adminProductsApi.createVariants(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail(variables.productId),
      });
      toast.success("Create variants successfully");
    },
    onError: (error) => {
      console.error("Error creating variants:", error);
      toast.error("Failed to create variants. Please try again.");
    },
  });
};
