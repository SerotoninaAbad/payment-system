import { Result } from '@core/Result';
import { Entity } from '@domain/Entity';
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { Guard } from '@core/Guard';
import { DateUtils } from '@utils/DateUtils';

export type PaymentStatus =
  | 'APPROVED'
  | 'REJECTED'
  | 'PENDING'
  | 'ERROR'
  | 'EXPIRED'
  | 'REFOUNDED';

interface PaymentProps {
  purchaseOrderID: string;
  status: PaymentStatus;
  statusDescription: string;
  invoiceNumber: string | null;
  amount: number;
  term: PaymentTerms;
  dateOfIssue: Date;
  validUntil: Date | null;
  userReferenceID: string;
}

export type PaymentTerms = 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL';

export class Payment extends Entity<PaymentProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get purchaseOrderID(): string {
    return this.props.purchaseOrderID;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get statusDescription(): string {
    return this.props.statusDescription;
  }

  get invoiceNumber(): string | null {
    return this.props.invoiceNumber;
  }

  get amount(): number {
    return this.props.amount;
  }

  get dateOfIssue(): Date {
    return this.props.dateOfIssue;
  }

  get userReferenceID(): string | null {
    return this.props.userReferenceID;
  }

  get validUntil(): Date | null {
    return this.props.validUntil;
  }

  constructor(props: PaymentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static calculateValidUntil(dateFrom: Date, term: PaymentTerms): Date {
    if (term === 'MONTHLY') {
      return DateUtils.addMonths(dateFrom, 1);
    } else if (term === 'QUARTERLY') {
      return DateUtils.addMonths(dateFrom, 3);
    } else if (term === 'BIANNUAL') {
      return DateUtils.addMonths(dateFrom, 6);
    }

    return DateUtils.addMonths(dateFrom, 12);
  }

  public static create(
    props: PaymentProps,
    id?: UniqueEntityID
  ): Result<Payment> {
    const greaterThanZeroResult = Guard.greaterThan(0, props.amount);
    if (!greaterThanZeroResult.succeeded) {
      return Result.fail<Payment>(
        `Error al crear cantidad. ${greaterThanZeroResult.message}`
      );
    }

    const paymentProps = {
      ...props,
      validUntil: Payment.calculateValidUntil(props.dateOfIssue, props.term)
    };

    const payment = new Payment(paymentProps, id);
    return Result.ok<Payment>(payment);
  }
}
