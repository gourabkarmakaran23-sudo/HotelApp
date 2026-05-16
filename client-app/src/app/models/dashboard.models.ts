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
