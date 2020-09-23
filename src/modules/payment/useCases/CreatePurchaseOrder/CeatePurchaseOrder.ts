import { Either, left, Result, right } from '@core/Result';
import { UseCase } from '@core/UseCase';
import { Buyer } from '../../domain/Buyer';
import { PurchaseOrder } from '../../domain/PurchaseOrder';
import { IBuyerRepo } from '../../repos/BuyerRepo';
import { v4 as uuid } from 'uuid';
import {
  IPaymentButton,
  CreatePurchasePaymentButtonDTO
} from '../../services/PaymentButton';
import { IPurchaseOrderRepo } from '../../repos/PurchaseOrderRepo';
import { CreatePurchaseOrderErrors } from './CreatePurchaseOrderErrors';
import { AppError } from '@core/AppError';

type Response = Either<
  | CreatePurchaseOrderErrors.CannotCreateBuyerError
  | CreatePurchaseOrderErrors.PurchaseOrderCreationError
  | AppError.UnexpectedError,
  Result<PurchaseOrder>
>;

export interface CreatePurchaseOrderDTO {
  userReference: string;
  userDNI: string;
  userName: string;
  userSurname: string;
  userEmail: string;
  referenceID: string;
  referenceDescription: string;
  dateOfIssue: string;
  amount: number;
  ipAddress: string;
  userAgent: string;
}

export class CreatePurchaseOrder
  implements UseCase<CreatePurchaseOrderDTO, Response> {
  public buyerRepo: IBuyerRepo;
  public paymentButton: IPaymentButton;
  public purchaseOrderRepo: IPurchaseOrderRepo;

  constructor(
    buyerRepo: IBuyerRepo,
    paymentButton: IPaymentButton,
    purchaseOrderRepo: IPurchaseOrderRepo
  ) {
    this.buyerRepo = buyerRepo;
    this.paymentButton = paymentButton;
    this.purchaseOrderRepo = purchaseOrderRepo;
  }

  public async execute(
    createPurchaseOrderDTO: CreatePurchaseOrderDTO
  ): Promise<Response> {
    let buyer: Buyer | null = null;

    try {
      buyer = await this.buyerRepo.getByReferenceID(
        createPurchaseOrderDTO.userReference
      );

      if (!buyer) {
        const buyerResult = Buyer.create({
          DNI: createPurchaseOrderDTO.userDNI,
          referenceID: createPurchaseOrderDTO.referenceID,
          name: createPurchaseOrderDTO.userName,
          surname: createPurchaseOrderDTO.userSurname,
          email: createPurchaseOrderDTO.userEmail
        });

        if (buyerResult.isFailure) {
          const errorMessage = buyerResult.error as string;
          return left(
            new CreatePurchaseOrderErrors.CannotCreateBuyerError(errorMessage)
          );
        } else {
          buyer = buyerResult.getValue(); //que pasa si da error, controlar el error
          await this.buyerRepo.save(buyer);
        }
      }
    } catch (e) {
      return left(new CreatePurchaseOrderErrors.CannotCreateBuyerError());
    }

    const purchaseID = uuid();

    const createPurchasePaymentButtonDTO: CreatePurchasePaymentButtonDTO = {
      buyer: {
        id: buyer.id.toString(),
        DNI: createPurchaseOrderDTO.userDNI,
        name: buyer.name,
        surname: buyer.surname,
        email: buyer.email
      },
      purchase: {
        purchaseOrderID: purchaseID,
        purchaseOrderReferenceID: createPurchaseOrderDTO.referenceID,
        purchaseOrderDescripcion: createPurchaseOrderDTO.referenceDescription,
        amount: createPurchaseOrderDTO.amount,
        date: new Date(createPurchaseOrderDTO.dateOfIssue),
        ipAddress: createPurchaseOrderDTO.ipAddress,
        userAgent: createPurchaseOrderDTO.userAgent
      }
    };

    const purchaseOrder = await this.paymentButton.createPurchaseOrder(
      createPurchasePaymentButtonDTO
    );

    try {
      await this.purchaseOrderRepo.save(purchaseOrder);
    } catch {
      return left(new CreatePurchaseOrderErrors.PurchaseOrderCreationError());
    }

    return right(Result.ok<PurchaseOrder>(purchaseOrder));
  }
}
