import { PaymentStatus } from '../domain/Payment';
import { PurchaseOrder } from '../domain/PurchaseOrder';

export interface CreatePurchasePaymentButtonDTO {
  buyer: {
    id: string;
    DNI: string;
    name: string;
    surname: string;
    email: string;
  };
  purchase: {
    purchaseOrderID: string;
    purchaseOrderReferenceID: string;
    purchaseOrderDescripcion: string;
    amount: number;
    date: Date;
    ipAddress: string;
    userAgent: string;
  };
}

export interface PaymentStatusDTO {
  status: PaymentStatus;
  statusDescription: string;
  statusDate: Date;
}

export interface IPaymentButton {
  createPurchaseOrder(
    paymentInfo: CreatePurchasePaymentButtonDTO
  ): Promise<PurchaseOrder>;

  getPaymentStatus(receiptNumber: string): Promise<PaymentStatusDTO>;
}
