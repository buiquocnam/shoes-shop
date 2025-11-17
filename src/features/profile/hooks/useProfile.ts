'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/profile.api';
import { UpdateProfileRequest, ChangePasswordRequest } from '../types';
import { toast } from 'sonner';


export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      toast.success('Cập nhật profile thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Cập nhật profile thất bại');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Thay đổi mật khẩu thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Thay đổi mật khẩu thất bại');
    },
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => profileApi.getAddresses(),
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Thêm địa chỉ thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Thêm địa chỉ thất bại');
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      profileApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Cập nhật địa chỉ thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Cập nhật địa chỉ thất bại');
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Xóa địa chỉ thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xóa địa chỉ thất bại');
    },
  });
};
