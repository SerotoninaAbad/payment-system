import { Payment } from '../domain/Payment';

export interface IPaymentRepo {
  save(payment: Payment): Promise<void>;
}
