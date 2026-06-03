export interface DashboardSummary {
  activeBookings: number;
  revenue: number;
  occupancyRate: number;
  pendingRequests: number;
}

export interface RoomTypeBookingHistoryRow {
  roomType: string;
  values: { [date: string]: string };
}

export interface RoomTypeBookingHistoryResponse {
  dates: string[];
  rows: RoomTypeBookingHistoryRow[];
}

export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
}

export interface OccupancyRow {
  room: string;
  status: string;
  badge: string;
}

export interface RoomOccupancyData {
  roomNumber: string;
  roomId: number;
  [key: string]: any; // For date columns with { date: string, status: string }
}

export interface OccupancyGridResponse {
  dates: string[];
  rooms: RoomOccupancyData[];
}
