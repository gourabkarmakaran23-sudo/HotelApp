export interface RoomTypeDto {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface CreateRoomTypeDto {
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}