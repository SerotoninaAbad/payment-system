import { UniqueEntityID } from '@domain/UniqueEntityID';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PurchaseOrder } from '../../../domain/PurchaseOrder';
import { IPurchaseOrderRepo } from '../../PurchaseOrderRepo';

export class FakePurchaseOrderRepo implements IPurchaseOrderRepo {
  failOnSave: boolean;

  constructor(failOnSave = false) {
    this.failOnSave = failOnSave;
  }

  async save(purchaseOrder: PurchaseOrder): Promise<void> {
    const promiseResponse = new Promise<void>((resolve, reject) => {
      setTimeout(
        (resolve, reject, fail) => {
          if (fail) {
            reject();
          } else {
            resolve();
          }
        },
        100,
        resolve,
        reject,
        this.failOnSave
      );
    });
    return promiseResponse;
  }

  async getByID(ID: string): Promise<PurchaseOrder> {
    const purchaseOrderResult = PurchaseOrder.create(
      {
        buyerID: '92267f0b-54e2-45c2-bb96-9431f4478712',
        receiptNumber: '0123456789',
        referenceID: '030030040404004',
        referenceDescription: 'Curso Ser Bachiller',
        dateOfIssue: new Date(2020, 8, 21, 12, 30, 34),
        amount: 80,
        ipAddress: '192.168.23.22',
        userAgent: 'Mozilla Firefox Mac',
        webCheckoutURL: 'https://button.com.ec/pay'
      },
      new UniqueEntityID(ID)
    );

    const purchaseOrder = purchaseOrderResult.getValue();

    return Promise.resolve(purchaseOrder);
  }
}
