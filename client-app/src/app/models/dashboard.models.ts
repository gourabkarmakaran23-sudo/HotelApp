export interface DashboardSummary {
  activeBookings: number;
  revenue: number;
  occupancyRate: number;
  pendingRequests: number;
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
