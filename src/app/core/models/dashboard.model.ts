export interface DashboardData {
  totalProducts: number;
  lowStockProducts: number;
  inventoryValue: number;
  monthlyMovements: number;
  movementsByMonth: { month: string; incoming: number; outgoing: number }[];
  productsByCategory: { category: string; count: number }[];
  inventoryValueOverTime: { month: string; value: number }[];
  recentActivity: {
    id: string;
    productName: string;
    type: string;
    quantity: number;
    userName: string;
    date: string;
  }[];
}
