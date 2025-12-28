import axiosInstance from "@/lib/axios";
import {
  ProvincesType,
  DistrictsType,
  WardsType,
  AddressType,
} from "../types/address";

export interface CreateAddressRequest {
  userId: string;
  provinceCode: number;
  provinceName: string;
  districtCode: number;
  districtName: string;
  wardCode: number;
  wardName: string;
  addressLine: string;
  isDefault: boolean;
}

export const addressApi = {
  getUsersAddress: async (userId: string) => {
    const response = await axiosInstance.get<AddressType[]>(
      `/shoes/public/address/user/${userId}`
    );
    return response.data;
  },

  createAddress: async (data: CreateAddressRequest) => {
    const response = await axiosInstance.post<AddressType>(
      "/shoes/public/address/create",
      data
    );
    return response.data;
  },

  updateAddress: async (data: AddressType) => {
    const response = await axiosInstance.put<AddressType>(
      `/shoes/public/address/${data.id}`,
      data
    );
    return response.data;
  },

  deleteAddress: async (addressId: string) => {
    await axiosInstance.delete(`/shoes/public/address/${addressId}`);
  },

  updateDefaultAddress: async (addressId: string) => {
    const response = await axiosInstance.put<AddressType>(
      `/shoes/public/address/${addressId}/default`
    );
    return response.data;
  },

  getProvinces: async () => {
    const response = await axiosInstance.get<ProvincesType[]>(
      "/shoes/public/address/provinces"
    );
    return response.data;
  },

  getDistricts: async (provinceCode: number) => {
    const response = await axiosInstance.get<DistrictsType[]>(
      `/shoes/public/address/provinces/${provinceCode}/districts`
    );
    return response.data;
  },

  getWards: async (districtCode: number) => {
    const response = await axiosInstance.get<WardsType[]>(
      `/shoes/public/address/districts/${districtCode}/wards`
    );
    return response.data;
  },
};
