import { ShippingAddress, ShippingMethod } from '../types';

// Mock shipping addresses
export const mockShippingAddresses: ShippingAddress[] = [
  {
    id: '1',
    type: 'home',
    fullName: 'Nguyễn Văn A',
    address: '123 Đường ABC, Phường XYZ',
    city: 'Hà Nội',
    state: 'Hà Nội',
    zipCode: '100000',
    country: 'Việt Nam',
    phone: '0123456789',
  },
  {
    id: '2',
    type: 'work',
    fullName: 'Nguyễn Văn A',
    address: '456 Đường DEF, Tầng 5, Tòa nhà GHI',
    city: 'Hà Nội',
    state: 'Hà Nội',
    zipCode: '100000',
    country: 'Việt Nam',
    phone: '0987654321',
  },
];

// Mock shipping methods
export const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Vận chuyển tiêu chuẩn',
    description: '4-7 ngày làm việc',
    price: 50000,
    estimatedDays: '4-7 business days',
  },
  {
    id: 'express',
    name: 'Vận chuyển nhanh',
    description: '1-3 ngày làm việc',
    price: 150000,
    estimatedDays: '1-3 business days',
  },
];































