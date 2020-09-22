import { PurchaseOrder } from '../PurchaseOrder';
import { UniqueEntityID } from '@domain/UniqueEntityID';

const dateOfIssue = new Date();
const purchaseOrderData = {
  id: '0f627eb6-2d8f-44e9-a815-2f91f5e9295f',
  buyerID: '0103862119',
  receiptNumber: '03345-005-334',
  referenceID: '0030233-939499394932-223',
  referenceDescription: 'Un curso Ser Bachiller para periodo 2020-2021',
  dateOfIssue,
  amount: 123.44,
  ipAddress: '01.023.23.112',
  userAgent: 'Mozilla Firefox Mac',
  webCheckoutURL: 'htttp://lospolloshermanos.com/webcheckout'
};

describe('Purchase Order Class', () => {
  test('create new object without ID', () => {
    const purchaseOrderResult = PurchaseOrder.create({
      buyerID: purchaseOrderData.buyerID,
      receiptNumber: purchaseOrderData.receiptNumber,
      referenceID: purchaseOrderData.referenceID,
      referenceDescription: purchaseOrderData.referenceDescription,
      dateOfIssue: purchaseOrderData.dateOfIssue,
      amount: purchaseOrderData.amount,
      ipAddress: purchaseOrderData.ipAddress,
      userAgent: purchaseOrderData.userAgent,
      webCheckoutURL: purchaseOrderData.webCheckoutURL
    });

    const purchaseOrder = purchaseOrderResult.getValue();

    expect(purchaseOrder.id.toValue()).not.toBeNull();
    expect(purchaseOrder.receiptNumber).toBe(purchaseOrderData.receiptNumber);
    expect(purchaseOrder.referenceID).toBe(purchaseOrderData.referenceID);
    expect(purchaseOrder.referenceDescription).toBe(
      purchaseOrderData.referenceDescription
    );
    expect(purchaseOrder.dateOfIssue).toBe(purchaseOrderData.dateOfIssue);
    expect(purchaseOrder.amount).toBe(purchaseOrderData.amount);
    expect(purchaseOrder.ipAddress).toBe(purchaseOrderData.ipAddress);
    expect(purchaseOrder.userAgent).toBe(purchaseOrderData.userAgent);
    expect(purchaseOrder.webCheckoutURL).toBe(purchaseOrderData.webCheckoutURL);
  });

  test('create new object with ID', () => {
    const purchaseOrderResult = PurchaseOrder.create(
      {
        buyerID: purchaseOrderData.buyerID,
        receiptNumber: purchaseOrderData.receiptNumber,
        referenceID: purchaseOrderData.referenceID,
        referenceDescription: purchaseOrderData.referenceDescription,
        dateOfIssue: purchaseOrderData.dateOfIssue,
        amount: purchaseOrderData.amount,
        ipAddress: purchaseOrderData.ipAddress,
        userAgent: purchaseOrderData.userAgent,
        webCheckoutURL: purchaseOrderData.webCheckoutURL
      },
      new UniqueEntityID(purchaseOrderData.id)
    );

    const purchaseOrder = purchaseOrderResult.getValue();

    expect(purchaseOrder.id.toValue()).toBe(purchaseOrderData.id);
  });

  test('create object with negative amount', () => {
    const purchaseOrderResult = PurchaseOrder.create(
      {
        buyerID: purchaseOrderData.buyerID,
        receiptNumber: purchaseOrderData.receiptNumber,
        referenceID: purchaseOrderData.referenceID,
        referenceDescription: purchaseOrderData.referenceDescription,
        dateOfIssue: purchaseOrderData.dateOfIssue,
        amount: -122,
        ipAddress: purchaseOrderData.ipAddress,
        userAgent: purchaseOrderData.userAgent,
        webCheckoutURL: purchaseOrderData.webCheckoutURL
      },
      new UniqueEntityID(purchaseOrderData.id)
    );

    expect(purchaseOrderResult.isFailure).toBeTruthy();
    expect(purchaseOrderResult.error).toBe(
      'Error al crear cantidad. El número {-122} no es mayor a {0}'
    );
  });
});
