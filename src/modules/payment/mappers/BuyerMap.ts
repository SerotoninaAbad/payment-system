import { Buyer } from '../domain/Buyer';

export interface BuyerDTO {
  DNI: string | null;
  referenciID: string | null;
  name: string;
  surname: string;
  email: string;
}

export class BuyerMap {
  public static toDTO(buyer: Buyer): BuyerDTO {
    return {
      DNI: buyer.DNI,
      referenciID: buyer.referenceID,
      name: buyer.name,
      surname: buyer.surname,
      email: buyer.email
    };
  }
}
