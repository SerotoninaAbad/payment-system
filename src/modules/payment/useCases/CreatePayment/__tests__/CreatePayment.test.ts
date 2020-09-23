import { UseCaseError } from '@core/UseCaseError';
import { Payment } from 'src/modules/payment/domain/Payment';
import { FakePaymentRepo } from '../../../repos/implementations/__tests__/FakePaymentRepo';
import { CreatePayment, CreatePaymentDTO } from '../CreatePayment';

const createPaymentDTO: CreatePaymentDTO = {
  purchaseOrderID: '00210020192934'
};

describe('Create Payment', () => {
  test('Return a new Payment', async () => {
    const spy = jest.spyOn(FakePaymentRepo.prototype, 'save');
    const fakePaymentRepo = new FakePaymentRepo();
    const createPayment = new CreatePayment(fakePaymentRepo);
    const paymentResult = await createPayment.execute(createPaymentDTO);

    expect(paymentResult.isRight).toBeTruthy();

    const payment = paymentResult.value.getValue() as Payment;
    expect(payment.purchaseOrderID).toBe(createPaymentDTO.purchaseOrderID);
    expect(payment.status).toBe('PENDING');
    expect(payment.invoiceNumber).toBeNull();
    expect(payment.statusDescription).toBe(
      'Regresó del botón de pagos. Transacción no verificada'
    );

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  test('Handle Payment Creation Errors', async () => {
    const fakePaymentRepo = new FakePaymentRepo();
    const createPayment = new CreatePayment(fakePaymentRepo);
    const errorResult = await createPayment.execute({ purchaseOrderID: '' });

    expect(errorResult.isLeft()).toBeTruthy();
    const error = errorResult.value.error as UseCaseError;
    expect(error.message).toBe('No se pudo crear el pago.');
  });

  test('Handle Payment Saving on Database Errors', async () => {
    const spy = jest
      .spyOn(FakePaymentRepo.prototype, 'save')
      .mockImplementation(() => {
        throw new Error();
      });
    const fakePaymentRepo = new FakePaymentRepo();
    const createPayment = new CreatePayment(fakePaymentRepo);

    const errorResult = await createPayment.execute({
      purchaseOrderID: '123123123123'
    });

    expect(errorResult.isLeft()).toBeTruthy();
    const error = errorResult.value.error as UseCaseError;
    expect(error.message).toBe('Error al grabar el pago en la base de datos.');

    spy.mockRestore();
  });
});
