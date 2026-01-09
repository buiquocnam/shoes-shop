import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi } from "../services/address.api";
import { CreateAddressRequest } from "@/types/address";
import { addressQueryKeys } from "../constants/shared-queryKeys";
import { toast } from "sonner";

export const useUsersAddress = (userId: string) => {
  return useQuery({
    queryKey: addressQueryKeys.usersAddress(userId),
    queryFn: () => addressApi.getUsersAddress(userId),
    enabled: !!userId,
  });
};

export const useCreateAddress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => addressApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressQueryKeys.usersAddress(userId),
      });
      toast.success("Địa chỉ đã được thêm thành công");
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi thêm địa chỉ";
      toast.error(message);
    },
  });
};

/**
 * Hook để delete address
 */
export const useDeleteAddress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => addressApi.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressQueryKeys.usersAddress(userId),
      });
      toast.success("Địa chỉ đã được xóa thành công");
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa địa chỉ";
      toast.error(message);
    },
  });
};

/**
 * Hook để set default address
 */
export const useUpdateDefaultAddress = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      addressApi.updateDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressQueryKeys.usersAddress(userId),
      });
      toast.success("Đã thay đổi địa chỉ mặc định thành công");
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi thay đổi địa chỉ mặc định";
      toast.error(message);
    },
  });
};

export const useProvinces = () => {
  return useQuery({
    queryKey: addressQueryKeys.provinces,
    queryFn: addressApi.getProvinces,
  });
};

export const useDistricts = (provinceCode: number) => {
  return useQuery({
    queryKey: addressQueryKeys.districts(provinceCode),
    queryFn: () => addressApi.getDistricts(provinceCode),
    enabled: !!provinceCode,
  });
};
export const useWards = (districtCode: number) => {
  return useQuery({
    queryKey: addressQueryKeys.wards(districtCode),
    queryFn: () => addressApi.getWards(districtCode),
    enabled: !!districtCode,
  });
};
