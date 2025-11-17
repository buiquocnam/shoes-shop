
export interface UpdateProfileRequest {
  name: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
  isDefault: boolean;
}
