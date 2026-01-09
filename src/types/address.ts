/**
 * Global Address Types
 */

// Address type from API (Actual structure)
export interface AddressType {
  id: string;
  userId: string;
  provinceCode: number;
  provinceName: string;
  districtCode: number;
  districtName: string;
  wardCode: number;
  wardName: string;
  addressLine: string;
  isDefault: boolean;
  nameReceiver?: string;
  phoneReceiver?: string;
}

// Optimized helper type: CreateAddressRequest extends Address but omits ID (optional for update)
// and makes receiver fields required (if that's the business logic for create/update)
export interface CreateAddressRequest extends Omit<AddressType, 'id' | 'nameReceiver' | 'phoneReceiver'> {
  addressId?: string; // Optional for update
  nameReceiver: string; // Required for create/update
  phoneReceiver: string; // Required for create/update
}

export interface ShippingAddressDisplay {
  id: string;
  fullName: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  city: string;
  isDefault: boolean;
}

export interface ProvincesType {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code: string;
  districts: DistrictsType[];
}

export interface DistrictsType {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  province_code: number;
  wards: WardsType[];
}

export interface WardsType {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  district_code: number;
}
