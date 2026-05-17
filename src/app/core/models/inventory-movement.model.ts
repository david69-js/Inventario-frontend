export enum MovementType {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  ADJUSTMENT = 'ADJUSTMENT',
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName?: string;
  type: MovementType;
  quantity: number;
  description?: string;
  userId: string;
  userName?: string;
  createdAt: string;
}
