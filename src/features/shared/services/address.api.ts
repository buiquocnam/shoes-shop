import { apiClient } from "@/lib/api";
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
  getUsersAddress: async (userId: string): Promise<AddressType[]> => {
    const response = await apiClient.get<AddressType[]>(
      `/shoes/public/address/user/${userId}`
    );
    return response.result;
  },

  createAddress: async (data: CreateAddressRequest): Promise<AddressType> => {
    const response = await apiClient.post<AddressType>(
      "/shoes/public/address/create",
      data
    );
    return response.result;
  },

  updateAddress: async (data: AddressType): Promise<AddressType> => {
    const response = await apiClient.put<AddressType>(
      `/shoes/public/address/${data.id}`,
      data
    );
    return response.result;
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await apiClient.delete(`/shoes/public/address/${addressId}`);
  },

  updateDefaultAddress: async (addressId: string): Promise<AddressType> => {
    const response = await apiClient.put<AddressType>(
      `/shoes/public/address/${addressId}/default`
    );
    return response.result;
  },

  getProvinces: async (): Promise<ProvincesType[]> => {
    const response = await apiClient.get<ProvincesType[]>(
      "/shoes/public/address/provinces"
    );
    return response.result;
  },

  getDistricts: async (provinceCode: number): Promise<DistrictsType[]> => {
    const response = await apiClient.get<DistrictsType[]>(
      `/shoes/public/address/provinces/${provinceCode}/districts`
    );
    return response.result;
  },

  getWards: async (districtCode: number): Promise<WardsType[]> => {
    const response = await apiClient.get<WardsType[]>(
      `/shoes/public/address/districts/${districtCode}/wards`
    );
    return response.result;
  },
};
