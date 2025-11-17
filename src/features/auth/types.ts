

export interface User {
  id: string;
  role: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phone: string;
  address: string;
}


export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}


export interface AuthResponse extends RefreshTokenResponse {
  user: User;
}
