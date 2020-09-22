import { PurchaseOrder } from '../domain/PurchaseOrder';

export interface IPurchaseOrderRepo {
  save(purchaseOrder: PurchaseOrder): Promise<void>;
}
