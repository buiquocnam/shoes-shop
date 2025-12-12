import { AddressType, ShippingAddressDisplay } from '../types/address';

/**
 * Convert AddressType (từ API) sang ShippingAddressDisplay (cho hiển thị)
 */
export const convertAddressToDisplay = (
  address: AddressType,
  fullName?: string
): ShippingAddressDisplay => {
  // Tạo id từ các thông tin address
  const id = `${address.userId}-${address.provinceCode}-${address.districtCode}-${address.wardCode}-${address.addressLine}`;
  
  return {
    id,
    fullName: fullName || 'User', // Có thể lấy từ user profile
    address: address.addressLine,
    city: address.provinceName,
    district: address.districtName,
    ward: address.wardName,
    province: address.provinceName,
    isDefault: address.isDefault,
  };
};

/**
 * Convert array of AddressType sang ShippingAddressDisplay[]
 */
export const convertAddressesToDisplay = (
  addresses: AddressType[],
  fullName?: string
): ShippingAddressDisplay[] => {
  return addresses.map((address) => convertAddressToDisplay(address, fullName));
};

/**
 * Format address để hiển thị đầy đủ
 */
export const formatFullAddress = (address: AddressType): string => {
  return `${address.addressLine}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`;
};



