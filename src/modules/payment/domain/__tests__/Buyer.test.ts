import { Buyer } from '../Buyer';
import { UniqueEntityID } from '@domain/UniqueEntityID';

const buyerData = {
  id: '0f627eb6-2d8f-44e9-a815-2f91f5e9295f',
  referenceID: '0f627eb6-2d8f-44e9-a815-2f91f5e9295f',
  DNI: '0103862119',
  name: 'María Belén',
  surname: 'Abad Castro',
  email: 'hola@almendra.com.ec'
};

describe('Buyer Class', () => {
  test('create new buyer class without ID', () => {
    const buyerResult = Buyer.create(buyerData);

    const buyer = buyerResult.getValue();
    expect(buyer.id.toValue()).not.toBeNull();
    expect(buyer.DNI).toBe(buyerData.DNI);
    expect(buyer.name).toBe(buyerData.name);
    expect(buyer.email).toBe(buyerData.email);
    expect(buyer.referenceID).toBe(buyerData.referenceID);
    expect(buyer.surname).toBe(buyerData.surname);
  });

  test('create new buyer class with ID', () => {
    const buyerResult = Buyer.create(
      buyerData,
      new UniqueEntityID(buyerData.id)
    );

    const buyer = buyerResult.getValue();
    expect(buyer.id.toValue()).toBe(buyerData.id);
    expect(buyer.DNI).toBe(buyerData.DNI);
    expect(buyer.name).toBe(buyerData.name);
    expect(buyer.email).toBe(buyerData.email);
    expect(buyer.referenceID).toBe(buyerData.referenceID);
  });

  test('create new buyer with invalid email', () => {
    const buyerResult = Buyer.create(
      { ...buyerData, email: 'lalala' },
      new UniqueEntityID(buyerData.id)
    );

    expect(buyerResult.isFailure).toBeTruthy();
    expect(buyerResult.error).toBe(
      'Error al crear mail. lalala no es un correo válido.'
    );
  });
});
