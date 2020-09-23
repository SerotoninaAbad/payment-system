import { AppError } from '@core/AppError';
import { Either, Result, left, right } from '@core/Result';
import { UseCase } from '@core/UseCase';
import { Payment } from '../../domain/Payment';
import { IPaymentRepo } from '../../repos/PaymentRepo';
import { CreatePaymentErrors } from './CreatePaymentErrors';

export interface CreatePaymentDTO {
  purchaseOrderID: string;
}

type Response = Either<
  | CreatePaymentErrors.CannotCreatePaymentError
  | CreatePaymentErrors.CannotSaveOnDatabaseError
  | AppError.UnexpectedError,
  Result<Payment>
>;

export class CreatePayment implements UseCase<CreatePaymentDTO, Response> {
  paymentRepo: IPaymentRepo;

  constructor(paymentRepo: IPaymentRepo) {
    this.paymentRepo = paymentRepo;
  }

  async execute(createPaymentDTO: CreatePaymentDTO): Promise<Response> {
    const paymentResult = Payment.create({
      purchaseOrderID: createPaymentDTO.purchaseOrderID,
      status: 'PENDING',
      statusDescription:
        'Regresó del botón de pagos. Transacción no verificada',
      invoiceNumber: null,
      term: 'MONTHLY',
      dateOfIssue: new Date(),
      validUntil: null
    });

    if (paymentResult.isFailure) {
      return left(new CreatePaymentErrors.CannotCreatePaymentError());
    }

    try {
      await this.paymentRepo.save(paymentResult.getValue());
    } catch {
      return left(new CreatePaymentErrors.CannotSaveOnDatabaseError());
    }

    const payment = paymentResult.getValue();
    return right(Result.ok<Payment>(payment));
  }
}
