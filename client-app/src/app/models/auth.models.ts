// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   expiresIn?: number;
// }

// Define your Request payload model
export interface LoginRequest {
  email: string;
  password: string;
  selectedHotelId?: number | null;
  companyId?: number | null;
}

// Define your API Response model
export interface LoginResponse {
  token: string;
  activeHotelId?: number | null;
  activeCompanyId?: number | null;
  // include other properties returned by your API (e.g. userId, email, roles)
}

export interface RegisterRequest {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
  hotelId?: number | null;
  companyId?: number | null;
}
