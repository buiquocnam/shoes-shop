import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminProductsApi } from "../../services/products.api";
import { queryKeys } from "@/features/shared";

/**
 * Hook để xóa product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => adminProductsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.lists() });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    },
  });
};
