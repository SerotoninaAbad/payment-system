import { CreatePurchaseOrder } from '../CeatePurchaseOrder';
import { FakeBuyerRepo1 } from '../../../repos/implementations/__tests__/FakeBuyerRepo1';
import { FakeFailerBuyerRepo } from '../../../repos/implementations/__tests__/FakeFailerBuyerRepo';
import { FakePurchaseOrderRepo } from '../../../repos/implementations/__tests__/FakePurchaseOrderRepo';
import { FakePaymentButton } from '../../../services/implementations/__tests__/FakePaymentButton';
import { CreatePurchaseOrderDTO } from '../CeatePurchaseOrder';
import { PurchaseOrder } from '../../../domain/PurchaseOrder';
import { UseCaseError } from '@core/UseCaseError';

jest.mock('uuid', () => ({
  v4: () => {
    return '57b0a195-5483-4711-82d3-f3a1e0eabed9';
  }
}));

const createPurchaseOrderDTO: CreatePurchaseOrderDTO = {
  userReference: '002003048845',
  userDNI: '0103862119',
  userName: 'Maria Belén',
  userSurname: 'Abad Castro',
  userEmail: 'belen@almendra.com.ec',
  referenceID: '00300400300303',
  referenceDescription: 'Curso Ser Bachiller',
  dateOfIssue: '2016-04-26T18:09:16Z', //revisar que esta fecha no sea valida
  amount: 80,
  ipAddress: '123.122.33.22',
  userAgent: 'Mozilla firefox MacOS'
};

describe('Purchase Order Use Case', () => {
  test('return an order purchase by creating a user', async () => {
    const fakeBuyerRepo = new FakeBuyerRepo1();
    const fakePurchaseOrderRepo = new FakePurchaseOrderRepo();
    const fakePaymentButton = new FakePaymentButton();

    const createPurchaseOrder = new CreatePurchaseOrder(
      fakeBuyerRepo,
      fakePaymentButton,
      fakePurchaseOrderRepo
    );
    const result = await createPurchaseOrder.execute(createPurchaseOrderDTO);

    expect(result.isRight()).toBeTruthy();
    const purchaseOrder = result.value.getValue() as PurchaseOrder;

    expect(purchaseOrder.buyerID).toBe('57b0a195-5483-4711-82d3-f3a1e0eabed9');
    expect(purchaseOrder.receiptNumber).toBe('1234567890');
    expect(purchaseOrder.referenceID).toBe(createPurchaseOrderDTO.referenceID);
    expect(purchaseOrder.referenceDescription).toBe(
      createPurchaseOrderDTO.referenceDescription
    );
    expect(purchaseOrder.dateOfIssue.getTime()).toBe(
      new Date(createPurchaseOrderDTO.dateOfIssue).getTime()
    );
    expect(purchaseOrder.ipAddress).toBe(createPurchaseOrderDTO.ipAddress);
    expect(purchaseOrder.amount).toBe(createPurchaseOrderDTO.amount);
    expect(purchaseOrder.userAgent).toBe(createPurchaseOrderDTO.userAgent);
    expect(purchaseOrder.webCheckoutURL).toBe(
      'https://test.placetopay.com/redirection/session/181348/43d83d36aa46de5f993aafb9b3e0be48'
    );
  });

  test('return an order purchase by returning a existing user', async () => {
    const fakeBuyerRepo = new FakeBuyerRepo1(true);
    const fakePurchaseOrderRepo = new FakePurchaseOrderRepo();
    const fakePaymentButton = new FakePaymentButton();

    const createPurchaseOrder = new CreatePurchaseOrder(
      fakeBuyerRepo,
      fakePaymentButton,
      fakePurchaseOrderRepo
    );

    const createPurchaseOrderDTOwithUser = {
      ...createPurchaseOrderDTO,
      userReference: '99344883848383883883'
    };
    const result = await createPurchaseOrder.execute(
      createPurchaseOrderDTOwithUser
    );
    expect(result.isRight()).toBeTruthy();

    const purchaseOrder = result.value.getValue() as PurchaseOrder;

    expect(purchaseOrder.buyerID).toBe('0ca9c576-1658-42b8-8114-ab005e8eef35');
    expect(purchaseOrder.receiptNumber).toBe('1234567890');
    expect(purchaseOrder.referenceID).toBe(createPurchaseOrderDTO.referenceID);
    expect(purchaseOrder.referenceDescription).toBe(
      createPurchaseOrderDTO.referenceDescription
    );
    expect(purchaseOrder.dateOfIssue.getTime()).toBe(
      new Date(createPurchaseOrderDTO.dateOfIssue).getTime()
    );
    expect(purchaseOrder.ipAddress).toBe(createPurchaseOrderDTO.ipAddress);
    expect(purchaseOrder.amount).toBe(createPurchaseOrderDTO.amount);
    expect(purchaseOrder.userAgent).toBe(createPurchaseOrderDTO.userAgent);
    expect(purchaseOrder.webCheckoutURL).toBe(
      'https://test.placetopay.com/redirection/session/181348/43d83d36aa46de5f993aafb9b3e0be48'
    );
  });

  test('validate user email', async () => {
    const fakeBuyerRepo = new FakeBuyerRepo1();
    const fakePurchaseOrderRepo = new FakePurchaseOrderRepo();
    const fakePaymentButton = new FakePaymentButton();

    const createPurchaseOrder = new CreatePurchaseOrder(
      fakeBuyerRepo,
      fakePaymentButton,
      fakePurchaseOrderRepo
    );

    const createPurchaseOrderDTOwithBadEmail = {
      ...createPurchaseOrderDTO,
      userEmail: 'lalalala'
    };
    const result = await createPurchaseOrder.execute(
      createPurchaseOrderDTOwithBadEmail
    );

    expect(result.isLeft()).toBeTruthy();
    const response = 'Error al crear mail. lalalala no es un correo válido.';
    const resultError = result.value.error as UseCaseError;
    expect(resultError.message).toBe(response);
  });

  test('error when retreiving user from database', async () => {
    const fakeFailerBuyerRepo = new FakeFailerBuyerRepo(false, true);
    const fakePurchaseOrderRepo = new FakePurchaseOrderRepo();
    const fakePaymentButton = new FakePaymentButton();

    const createPurchaseOrder = new CreatePurchaseOrder(
      fakeFailerBuyerRepo,
      fakePaymentButton,
      fakePurchaseOrderRepo
    );

    const result = await createPurchaseOrder.execute(createPurchaseOrderDTO);

    expect(result.isLeft()).toBeTruthy();
    const resultError = result.value.error as UseCaseError;
    const response =
      'No se pudo obtener o crear el comprador en la base de datos.';
    expect(resultError.message).toBe(response);
  });

  test('error when saving a user in database', async () => {
    const fakeFailerBuyerRepo = new FakeFailerBuyerRepo(true, false);
    const fakePurchaseOrderRepo = new FakePurchaseOrderRepo();
    const fakePaymentButton = new FakePaymentButton();

    const createPurchaseOrder = new CreatePurchaseOrder(
      fakeFailerBuyerRepo,
      fakePaymentButton,
      fakePurchaseOrderRepo
    );

    const result = await createPurchaseOrder.execute(createPurchaseOrderDTO);

    expect(result.isLeft()).toBeTruthy();
    const resultError = result.value.error as UseCaseError;
    const response =
      'No se pudo obtener o crear el comprador en la base de datos.';
    expect(resultError.message).toBe(response);
  });

  test('error when saving a PurchaseOrder in database', async () => {
    const fakeBuyerRepo = new FakeBuyerRepo1();
    const fakePurchaseOrderRepo = new FakePurchaseOrderRepo(true);
    const fakePaymentButton = new FakePaymentButton();

    const createPurchaseOrder = new CreatePurchaseOrder(
      fakeBuyerRepo,
      fakePaymentButton,
      fakePurchaseOrderRepo
    );

    const result = await createPurchaseOrder.execute(createPurchaseOrderDTO);

    expect(result.isLeft()).toBeTruthy();
    const resultError = result.value.error as UseCaseError;
    const response = 'Error al grabar la orden de compra.';
    expect(resultError.message).toBe(response);
  });
});
