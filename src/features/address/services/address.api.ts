import axiosInstance from "@/lib/axios";
import {
  ProvincesType,
  DistrictsType,
  WardsType,
  AddressType,
  CreateAddressRequest,
} from "@/types/address";

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

  updateAddress: async (data: CreateAddressRequest) => {
     // User said share endpoint /shoes/public/address/create
     // So update also calls this.
    const response = await axiosInstance.post<AddressType>(
      "/shoes/public/address/create",
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
