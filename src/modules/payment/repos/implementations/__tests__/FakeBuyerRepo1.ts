/* eslint-disable @typescript-eslint/no-unused-vars */
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { Buyer } from '../../../domain/Buyer';
import { IBuyerRepo } from '../../BuyerRepo';

export class FakeBuyerRepo1 implements IBuyerRepo {
  returnUser: boolean;

  constructor(returnUser = false) {
    this.returnUser = returnUser;
  }

  async save(buyer: Buyer): Promise<void> {
    const promiseResponse = new Promise<void>((resolve, reject) => {
      setTimeout(
        (resolve) => {
          resolve();
        },
        200,
        resolve
      );
    });
    return promiseResponse;
  }

  async getByReferenceID(referenceID: string): Promise<Buyer | null> {
    const promiseResponse = new Promise<null>((resolve, reject) => {
      let buyerOrNull: Buyer | null = null;
      if (this.returnUser) {
        buyerOrNull = Buyer.create(
          {
            DNI: '0105085740',
            referenceID: '99344883848383883883',
            name: 'Jorge',
            surname: 'Padilla',
            email: 'jorge@almendra.com.ec'
          },
          new UniqueEntityID('0ca9c576-1658-42b8-8114-ab005e8eef35')
        ).getValue();
      }
      setTimeout(
        (resolve, value: Buyer | null) => {
          resolve(value);
        },
        200,
        resolve,
        buyerOrNull
      );
    });
    return promiseResponse;
  }
}
