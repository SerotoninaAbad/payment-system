/* eslint-disable @typescript-eslint/no-unused-vars */
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { Payment } from '../../../domain/Payment';
import { IPaymentRepo } from '../../PaymentRepo';

export class FakePaymentRepo implements IPaymentRepo {
  returnPayment: boolean;

  constructor(returnPayment = true) {
    this.returnPayment = returnPayment;
  }
  async saveOrUpdate(payment: Payment): Promise<void> {
    return Promise.resolve();
  }

  async getByID(ID: string): Promise<Payment | null> {
    if (this.returnPayment) {
      const paymentResult = Payment.create(
        {
          purchaseOrderID: '9d84c1ec-ab3d-430f-ac91-f7fd3253f933',
          status: 'PENDING',
          statusDescription: 'Pendiente',
          statusDateChange: new Date(2020, 8, 21, 12, 20, 20),
          invoiceNumber: null,
          term: 'MONTHLY',
          dateOfIssue: new Date(2020, 8, 21, 12, 20, 20),
          validUntil: null
        },
        new UniqueEntityID(ID)
      );
      return Promise.resolve(paymentResult.getValue());
    } else {
      return Promise.resolve(null);
    }
  }
}
