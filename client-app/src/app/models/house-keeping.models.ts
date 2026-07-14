export interface AssignRoomCard {
  roomNo: string;
  status: 'Checked In' | 'Ready' | 'Dirty' | 'Under Maintenance';
  floor: string;
  isSelected?: boolean;
}

export interface RoomCleaningLog {
  sl: number;
  id: number;
  name: string; // House keeper name
  roomNo: string;
  date: string;
  status: string;
}

export interface ChecklistItem {
  sl: number;
  id: number;
  taskName: string;
  type: 'House Keeper' | 'Laundry' | 'Room Maintenance';
}

export interface LaundryProduct {
  sl: number;
  productName: string;
  categoryName: string;
  inUse: number;
  inLaundry: number;
  ready: number;
}

export interface LaundryLog {
  sl: number;
  invoiceNo: string;
  laundryName: string;
  itemName: string;
  operateBy: string;
  taskName: string;
  itemCost: number;
  quantity: number;
  type: string;
  sendDate: string;
  receivedDate: string;
  paymentStatus: 'Paid' | 'Due' | 'Partial';
  comments?: string;
}

export interface LaundryPayment {
  id: number;
  sl: number;
  name: string;
  invoiceNo: string;
  laundryName: string;
  totalAmount: number;
  dueAmount: number;
  paidAmount: number;
}