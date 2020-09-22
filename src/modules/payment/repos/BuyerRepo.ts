import { Buyer } from '../domain/Buyer';

export interface IBuyerRepo {
  getByReferenceID(ID: string): Promise<Buyer | null>;
  save(buyer: Buyer): Promise<void>;
}
