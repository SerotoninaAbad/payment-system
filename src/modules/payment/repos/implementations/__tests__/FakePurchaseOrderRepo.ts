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
}
