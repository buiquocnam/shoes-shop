import { useBrands } from "@/features/shared/hooks/useBrands";
import { useCategories } from "@/features/shared/hooks/useCategories";

/**
 * Hook để lấy categories và brands cho product forms
 */
export const useProductFormData = (enabled: boolean = true) => {
  const { data: brandsData } = useBrands({}, { enabled });
  const { data: categories } = useCategories({ enabled });

  const brands = brandsData?.data || [];

  return {
    categories: categories || [],
    brands,
  };
};


















