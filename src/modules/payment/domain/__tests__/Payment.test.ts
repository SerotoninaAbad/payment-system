import { Payment, PaymentStatus, PaymentTerms } from '../Payment';
import { UniqueEntityID } from '@domain/UniqueEntityID';

const dateOfIssue = new Date(2020, 8, 15); //month is zero based
const statusDateChange = new Date(2020, 8, 16);
const status: PaymentStatus = 'APPROVED';
const term: PaymentTerms = 'MONTHLY';
const paymentData = {
  id: '1eb1de16-e116-4747-8f93-56ef09a26a68',
  purchaseOrderID: '0f627eb6-2d8f-44e9-a815-2f91f5e9295f',
  status,
  statusDescription: 'La transacción ha sido aprobada',
  statusDateChange,
  invoiceNumber: '001-0023-434',
  amount: 123,
  term,
  dateOfIssue,
  validUntil: null,
  userReferenceID: '099384775737219293'
};

describe('Payment Class', () => {
  test('Create object and test monthly valid until', () => {
    const paymentResult = Payment.create(
      paymentData,
      new UniqueEntityID(paymentData.id)
    );

    const payment = paymentResult.getValue();
    expect(payment.id.toValue()).toBe(paymentData.id);
    expect(payment.purchaseOrderID).toBe(paymentData.purchaseOrderID);
    expect(payment.status).toBe(paymentData.status);
    expect(payment.statusDescription).toBe(paymentData.statusDescription);
    expect(payment.invoiceNumber).toBe(paymentData.invoiceNumber);
    expect(payment.dateOfIssue).toBe(paymentData.dateOfIssue);
    expect(payment.validUntil?.toLocaleString()).toBe(
      '10/15/2020, 12:00:00 AM'
    );
    expect(payment.statusDateChange.toLocaleString()).toBe(
      '9/16/2020, 12:00:00 AM'
    );
  });

  test('Test quaterly, biannual y annual valid until', () => {
    let paymentResult = Payment.create({
      ...paymentData,
      term: 'QUARTERLY'
    });

    let payment = paymentResult.getValue();
    expect(payment.validUntil?.toLocaleString()).toBe(
      '12/15/2020, 12:00:00 AM'
    );

    paymentResult = Payment.create({
      ...paymentData,
      term: 'BIANNUAL'
    });

    payment = paymentResult.getValue();
    expect(payment.validUntil?.toLocaleString()).toBe('3/15/2021, 12:00:00 AM');

    paymentResult = Payment.create({
      ...paymentData,
      term: 'ANNUAL'
    });

    payment = paymentResult.getValue();
    expect(payment.validUntil?.toLocaleString()).toBe('9/15/2021, 12:00:00 AM');
  });
});
