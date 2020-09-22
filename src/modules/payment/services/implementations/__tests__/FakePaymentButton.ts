/* eslint-disable @typescript-eslint/no-unused-vars */
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { PurchaseOrder } from '../../../domain/PurchaseOrder';

import {
  CreatePurchasePaymentButtonDTO,
  IPaymentButton
} from '../../PaymentButton';

export class FakePaymentButton implements IPaymentButton {
  async createPurchaseOrder(
    paymentInfo: CreatePurchasePaymentButtonDTO
  ): Promise<PurchaseOrder> {
    const purchaseOrderResult = PurchaseOrder.create(
      {
        buyerID: paymentInfo.buyer.id,
        receiptNumber: '1234567890',
        referenceID: paymentInfo.purchase.purchaseOrderReferenceID,
        referenceDescription: paymentInfo.purchase.purchaseOrderDescripcion,
        dateOfIssue: new Date(paymentInfo.purchase.date),
        amount: paymentInfo.purchase.amount,
        ipAddress: paymentInfo.purchase.ipAddress,
        userAgent: paymentInfo.purchase.userAgent,
        webCheckoutURL:
          'https://test.placetopay.com/redirection/session/181348/43d83d36aa46de5f993aafb9b3e0be48'
      },
      new UniqueEntityID(paymentInfo.purchase.purchaseOrderID)
    );
    if (purchaseOrderResult.isFailure) {
      throw new Error('No se pudo crear la Orden de Compra');
    }

    const promiseResponse = new Promise<PurchaseOrder>((resolve) => {
      setTimeout(
        (resolve, purchaseOrder) => {
          resolve(purchaseOrder);
        },
        100,
        resolve,
        purchaseOrderResult.getValue()
      );
    });

    return promiseResponse;
  }
}
