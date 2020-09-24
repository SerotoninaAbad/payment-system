import { UseCase } from '@core/UseCase';
import { Result, Either, left, right } from '@core/Result';
import { VerifyPaymentErrors } from './VerifyPaymentErrors';
import { IPaymentRepo } from '../../repos/PaymentRepo';
import { IPaymentButton, PaymentStatusDTO } from '../../services/PaymentButton';
import { IPurchaseOrderRepo } from '../../repos/PurchaseOrderRepo';
import { Payment } from '../../domain/Payment';
import { PurchaseOrder } from '../../domain/PurchaseOrder';

export interface VerifyPaymentDTO {
  paymentID: string;
}

type Response = Either<
  | VerifyPaymentErrors.PaymentButtonResponseError
  | VerifyPaymentErrors.PaymentNotFoundError,
  Result<void>
>;

export class VerifyPayment implements UseCase<VerifyPaymentDTO, Response> {
  paymentRepo: IPaymentRepo;
  paymentButton: IPaymentButton;
  purchaseOrderRepo: IPurchaseOrderRepo;

  constructor(
    paymentRepo: IPaymentRepo,
    purchaseOrderRepo: IPurchaseOrderRepo,
    paymentButton: IPaymentButton
  ) {
    this.paymentRepo = paymentRepo;
    this.purchaseOrderRepo = purchaseOrderRepo;
    this.paymentButton = paymentButton;
  }
  async execute(verifyPaymentDTO: VerifyPaymentDTO): Promise<Response> {
    let payment: Payment | null;
    try {
      payment = await this.paymentRepo.getByID(verifyPaymentDTO.paymentID);
      if (!payment) {
        return left(new VerifyPaymentErrors.PaymentNotFoundError());
      }
    } catch {
      return left(new VerifyPaymentErrors.CannotRetrievePaymentError());
    }

    let purchaseOrder: PurchaseOrder;
    try {
      purchaseOrder = await this.purchaseOrderRepo.getByID(
        payment.purchaseOrderID
      );
    } catch {
      return left(new VerifyPaymentErrors.CannotRetrievePurchaseOrderError());
    }

    let paymentStatus: PaymentStatusDTO;
    try {
      paymentStatus = await this.paymentButton.getPaymentStatus(
        purchaseOrder.receiptNumber
      );
    } catch {
      return left(new VerifyPaymentErrors.PaymentButtonResponseError());
    }

    payment.status = paymentStatus.status;
    payment.statusDateChange = paymentStatus.statusDate;
    payment.statusDescription = paymentStatus.statusDescription;

    await this.paymentRepo.saveOrUpdate(payment);

    return right(Result.ok());
  }
}
