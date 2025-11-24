import { useQuery } from "@tanstack/react-query";
import { adminVariantsApi } from "../services/variants";
import { queryKeys } from "@/features/shared";

export const useVariants = () => {
    return useQuery({
        queryKey: queryKeys.admin.variants.lists(),
        queryFn: () => adminVariantsApi.getAll(),
    });
};  