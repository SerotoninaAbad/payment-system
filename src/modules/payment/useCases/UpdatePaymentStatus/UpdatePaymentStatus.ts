import { UseCase } from '@core/UseCase';
import { Result, Either, left, right } from '@core/Result';
import { UpdatePaymentStatusErrors } from './UpdatePaymentStatusErrors';
import { IPaymentRepo } from '../../repos/PaymentRepo';
import { IPaymentButton, PaymentStatusDTO } from '../../services/PaymentButton';
import { IPurchaseOrderRepo } from '../../repos/PurchaseOrderRepo';
import { Payment } from '../../domain/Payment';
import { PurchaseOrder } from '../../domain/PurchaseOrder';

export interface UpdatePaymentStatusDTO {
  paymentID: string;
}

type Response = Either<
  | UpdatePaymentStatusErrors.PaymentButtonResponseError
  | UpdatePaymentStatusErrors.PaymentNotFoundError,
  Result<void>
>;

export class UpdatePaymentStatus
  implements UseCase<UpdatePaymentStatusDTO, Response> {
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
  async execute(
    updatePaymentStatusDTO: UpdatePaymentStatusDTO
  ): Promise<Response> {
    let payment: Payment | null;
    try {
      payment = await this.paymentRepo.getByID(
        updatePaymentStatusDTO.paymentID
      );
      if (!payment) {
        return left(new UpdatePaymentStatusErrors.PaymentNotFoundError());
      }
    } catch {
      return left(new UpdatePaymentStatusErrors.CannotRetrievePaymentError());
    }

    let purchaseOrder: PurchaseOrder;
    try {
      purchaseOrder = await this.purchaseOrderRepo.getByID(
        payment.purchaseOrderID
      );
    } catch {
      return left(
        new UpdatePaymentStatusErrors.CannotRetrievePurchaseOrderError()
      );
    }

    let paymentStatus: PaymentStatusDTO;
    try {
      paymentStatus = await this.paymentButton.getPaymentStatus(
        purchaseOrder.receiptNumber
      );
    } catch {
      return left(new UpdatePaymentStatusErrors.PaymentButtonResponseError());
    }

    payment.status = paymentStatus.status;
    payment.statusDateChange = paymentStatus.statusDate;
    payment.statusDescription = paymentStatus.statusDescription;

    await this.paymentRepo.saveOrUpdate(payment);

    return right(Result.ok());
  }
}
