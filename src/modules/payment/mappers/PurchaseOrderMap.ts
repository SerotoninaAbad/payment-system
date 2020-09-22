import { PurchaseOrder } from '../domain/PurchaseOrder';
import { NumberUtils } from '@utils/NumberUtils';

export interface PurchaseOrderDTO {
  id: string;
  buyerID: string;
  receiptNumber: string;
  dateOfIssue: string;
  amount: string;
  webCheckoutURL: string;
}
export class PurchaseOrderMap {
  public static toDTO(purchaseOrder: PurchaseOrder): PurchaseOrderDTO {
    return {
      id: purchaseOrder.id.toString(),
      buyerID: purchaseOrder.buyerID,
      receiptNumber: purchaseOrder.receiptNumber,
      dateOfIssue: purchaseOrder.dateOfIssue.toString(),
      amount: NumberUtils.toFormatedString(purchaseOrder.amount),
      webCheckoutURL: purchaseOrder.webCheckoutURL
    };
  }
}
