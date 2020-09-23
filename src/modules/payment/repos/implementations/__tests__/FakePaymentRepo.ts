/* eslint-disable @typescript-eslint/no-unused-vars */
import { Payment } from 'src/modules/payment/domain/Payment';
import { IPaymentRepo } from '../../PaymentRepo';

export class FakePaymentRepo implements IPaymentRepo {
  save(payment: Payment): Promise<void> {
    return Promise.resolve();
  }
}
