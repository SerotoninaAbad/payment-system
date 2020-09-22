import { Result } from '@core/Result';
import { Entity } from '@domain/Entity';
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { Guard } from '@core/Guard';

interface PurchaseOrderProps {
  buyerID: string;
  receiptNumber: string;
  referenceID: string;
  referenceDescription: string;
  dateOfIssue: Date;
  amount: number;
  ipAddress: string;
  userAgent: string;
  webCheckoutURL: string;
}
export class PurchaseOrder extends Entity<PurchaseOrderProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get buyerID(): string {
    return this.props.buyerID;
  }

  get receiptNumber(): string {
    return this.props.receiptNumber;
  }

  get referenceID(): string {
    return this.props.referenceID;
  }

  get referenceDescription(): string {
    return this.props.referenceDescription;
  }

  get dateOfIssue(): Date {
    return this.props.dateOfIssue;
  }

  get amount(): number {
    return this.props.amount;
  }

  get ipAddress(): string {
    return this.props.ipAddress;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get webCheckoutURL(): string {
    return this.props.webCheckoutURL;
  }

  constructor(props: PurchaseOrderProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: PurchaseOrderProps,
    id?: UniqueEntityID
  ): Result<PurchaseOrder> {
    const greaterThanZeroResult = Guard.greaterThan(0, props.amount);
    if (!greaterThanZeroResult.succeeded) {
      return Result.fail<PurchaseOrder>(
        `Error al crear cantidad. ${greaterThanZeroResult.message}`
      );
    }
    const purchaseOrderProps = { ...props };
    const purchaseOrder = new PurchaseOrder(purchaseOrderProps, id);
    return Result.ok<PurchaseOrder>(purchaseOrder);
  }
}
