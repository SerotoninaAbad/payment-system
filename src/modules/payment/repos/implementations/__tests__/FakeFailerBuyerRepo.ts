/* eslint-disable @typescript-eslint/no-unused-vars */
import { Buyer } from '../../../domain/Buyer';
import { IBuyerRepo } from '../../BuyerRepo';

export class FakeFailerBuyerRepo implements IBuyerRepo {
  failOnSave: boolean;
  failOnGetByReference: boolean;

  constructor(failOnSave: boolean, failOnGetByReference: boolean) {
    this.failOnSave = failOnSave;
    this.failOnGetByReference = failOnGetByReference;
  }

  async save(buyer: Buyer): Promise<void> {
    const promiseResponse = new Promise<void>((resolve, reject) => {
      const response = this.failOnSave ? reject : resolve;
      setTimeout(
        (response) => {
          response();
        },
        100,
        response
      );
    });
    return promiseResponse;
  }

  async getByReferenceID(referenceID: string): Promise<Buyer | null> {
    const promiseResponse = new Promise<null>((resolve, reject) => {
      const buyerOrNull = null;

      setTimeout(
        (resolve, reject, value: null, fail) => {
          if (fail) {
            reject();
          } else {
            resolve(value);
          }
        },
        100,
        resolve,
        reject,
        buyerOrNull,
        this.failOnGetByReference
      );
    });
    return promiseResponse;
  }
}
