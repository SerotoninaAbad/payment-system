import { Result } from '@core/Result';
import { Entity } from '@domain/Entity';
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { Guard } from '@core/Guard';

interface BuyerProps {
  DNI: string | null;
  referenceID: string | null;
  name: string;
  surname: string;
  email: string;
}

export class Buyer extends Entity<BuyerProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get DNI(): string | null {
    return this.props.DNI;
  }

  get referenceID(): string | null {
    return this.props.referenceID;
  }

  get name(): string {
    return this.props.name;
  }

  get surname(): string {
    return this.props.surname;
  }

  get email(): string {
    return this.props.email;
  }

  constructor(props: BuyerProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: BuyerProps, id?: UniqueEntityID): Result<Buyer> {
    const isValidEmailResult = Guard.isValidEmail(props.email);
    if (!isValidEmailResult.succeeded) {
      return Result.fail<Buyer>(
        `Error al crear mail. ${isValidEmailResult.message}`
      );
    }

    const buyerProps = { ...props };
    const buyer = new Buyer(buyerProps, id);
    return Result.ok<Buyer>(buyer);
  }
}
