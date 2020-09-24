import { Payment } from '../domain/Payment';

export interface IPaymentRepo {
  saveOrUpdate(payment: Payment): Promise<void>;
  getByID(ID: string): Promise<Payment | null>;
}
