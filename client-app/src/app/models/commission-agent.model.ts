export interface CommissionAgent {
  id?: number;
  agentName: string;
  commissionRate: number;
  address?: string;
  mobile?: string;
  email?: string;
  gstin?: string;
  isActive: boolean;
}