/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UpdatePaymentStatus,
  UpdatePaymentStatusDTO
} from '../UpdatePaymentStatus';
import { FakePaymentRepo } from '../../../repos/implementations/__tests__/FakePaymentRepo';
import { FakePaymentButton } from '../../../services/implementations/__tests__/FakePaymentButton';
import { FakePurchaseOrderRepo } from '../../../repos/implementations/__tests__/FakePurchaseOrderRepo';
import { Payment } from '../../../domain/Payment';
import { UniqueEntityID } from '@domain/UniqueEntityID';
import { UseCaseError } from '@core/UseCaseError';

const updatePaymentStatusDTO: UpdatePaymentStatusDTO = {
  paymentID: '08ba3734-ee74-4359-b9b5-312d0666f724'
};

describe('UpdatePaymentStatus', () => {
  test('Verify payment status with payment system and update it', async () => {
    const spyGetPayment = jest.spyOn(FakePaymentRepo.prototype, 'getByID');
    const spySavePayment = jest.spyOn(
      FakePaymentRepo.prototype,
      'saveOrUpdate'
    );
    const spyGetPurchaseOrder = jest.spyOn(
      FakePurchaseOrderRepo.prototype,
      'getByID'
    );
    const spyGetPaymentStatusFromButton = jest.spyOn(
      FakePaymentButton.prototype,
      'getPaymentStatus'
    );

    const paymentRepo = new FakePaymentRepo();
    const paymentButton = new FakePaymentButton();
    const purchaseOrderRepo = new FakePurchaseOrderRepo();

    const updatePaymentStatus = new UpdatePaymentStatus(
      paymentRepo,
      purchaseOrderRepo,
      paymentButton
    );

    await updatePaymentStatus.execute(updatePaymentStatusDTO);
    expect(spyGetPayment).toHaveBeenCalledTimes(1);

    expect(spyGetPurchaseOrder).toHaveBeenCalledTimes(1);
    expect(spyGetPurchaseOrder).toHaveBeenCalledWith(
      '9d84c1ec-ab3d-430f-ac91-f7fd3253f933'
    );
    expect(spyGetPaymentStatusFromButton).toHaveBeenCalledTimes(1);
    expect(spyGetPaymentStatusFromButton).toHaveBeenLastCalledWith(
      '0123456789'
    );

    expect(spySavePayment).toHaveBeenCalledTimes(1);
    const updatedPaymentResult = Payment.create(
      {
        purchaseOrderID: '9d84c1ec-ab3d-430f-ac91-f7fd3253f933',
        dateOfIssue: new Date(2020, 8, 21, 12, 20, 20),
        invoiceNumber: null,
        status: 'APPROVED',
        statusDescription: 'No errors',
        statusDateChange: new Date(2020, 8, 23, 12, 34, 23),
        term: 'MONTHLY',
        validUntil: null
      },
      new UniqueEntityID(updatePaymentStatusDTO.paymentID)
    );
    const updatedPayment = updatedPaymentResult.getValue();
    expect(spySavePayment).toHaveBeenCalledWith(updatedPayment);

    spyGetPayment.mockRestore();
    spyGetPurchaseOrder.mockRestore();
    spyGetPaymentStatusFromButton.mockRestore();
  });

  test('Handle errors in paymentRepo.getByID', async () => {
    const spyGetPayment = jest
      .spyOn(FakePaymentRepo.prototype, 'getByID')
      .mockImplementation((hola: string) => {
        throw new Error();
      });

    const paymentRepo = new FakePaymentRepo();
    const paymentButton = new FakePaymentButton();
    const purchaseOrderRepo = new FakePurchaseOrderRepo();

    const updatePaymentStatus = new UpdatePaymentStatus(
      paymentRepo,
      purchaseOrderRepo,
      paymentButton
    );

    const result = await updatePaymentStatus.execute(updatePaymentStatusDTO);
    expect(result.isLeft()).toBeTruthy();
    const errorMessage = result.value.error as UseCaseError;
    expect(errorMessage.message).toBe(
      'Error al intentar obtener el pago de la base de datos.'
    );

    spyGetPayment.mockRestore();
  });

  test('Handle errors in purchaseOrderRepo.getByID', async () => {
    const spyGetPurchaseOrder = jest
      .spyOn(FakePurchaseOrderRepo.prototype, 'getByID')
      .mockImplementation((hola: string) => {
        throw new Error();
      });

    const paymentRepo = new FakePaymentRepo();
    const paymentButton = new FakePaymentButton();
    const purchaseOrderRepo = new FakePurchaseOrderRepo();

    const updatePaymentStatus = new UpdatePaymentStatus(
      paymentRepo,
      purchaseOrderRepo,
      paymentButton
    );

    const result = await updatePaymentStatus.execute(updatePaymentStatusDTO);
    expect(result.isLeft()).toBeTruthy();
    const errorMessage = result.value.error as UseCaseError;
    expect(errorMessage.message).toBe(
      'Error al intentar obtener la orden de compra de la base de datos.'
    );

    spyGetPurchaseOrder.mockRestore();
  });

  test('Handle errors in paymentButton.getPaymentStatus', async () => {
    const spyGetPaymentStatus = jest
      .spyOn(FakePaymentButton.prototype, 'getPaymentStatus')
      .mockImplementation((hola: string) => {
        throw new Error();
      });

    const paymentRepo = new FakePaymentRepo();
    const paymentButton = new FakePaymentButton();
    const purchaseOrderRepo = new FakePurchaseOrderRepo();

    const updatePaymentStatus = new UpdatePaymentStatus(
      paymentRepo,
      purchaseOrderRepo,
      paymentButton
    );

    const result = await updatePaymentStatus.execute(updatePaymentStatusDTO);
    expect(result.isLeft()).toBeTruthy();
    const errorMessage = result.value.error as UseCaseError;
    expect(errorMessage.message).toBe(
      'Error al conectarse con el botón de pagos.'
    );

    spyGetPaymentStatus.mockRestore();
  });

  test('Payment does not exists', async () => {
    const paymentRepo = new FakePaymentRepo(false);
    const paymentButton = new FakePaymentButton();
    const purchaseOrderRepo = new FakePurchaseOrderRepo();

    const updatePaymentStatus = new UpdatePaymentStatus(
      paymentRepo,
      purchaseOrderRepo,
      paymentButton
    );

    const result = await updatePaymentStatus.execute(updatePaymentStatusDTO);
    expect(result.isLeft()).toBeTruthy();
    const errorMessage = result.value.error as UseCaseError;
    expect(errorMessage.message).toBe(
      'El ID de compra no ha sido encontrado en nuestra base de datos.'
    );
  });
});
