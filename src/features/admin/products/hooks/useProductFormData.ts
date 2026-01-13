import { useBrands } from "@/features/product/hooks/useBrands";
import { useCategories } from "@/features/product/hooks/useCategories";

/**
 * Hook để lấy categories và brands cho product forms
 */
export const useProductFormData = () => {
  const { data: brandsData, isLoading: isLoadingBrands } = useBrands();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();


  return {
    categories: categories?.data || [],
    brands: brandsData?.data || [],
    isLoading: isLoadingBrands || isLoadingCategories,
  };
};
