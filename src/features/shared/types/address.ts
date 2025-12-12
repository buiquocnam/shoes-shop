/**
 * Shared Address Types
 * Được sử dụng chung cho cả profile và checkout để tránh duplicate
 */

// Address type từ API (cấu trúc thực tế)
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
  