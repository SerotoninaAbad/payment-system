import { Result } from '@core/Result';
import { UseCaseError } from '@core/UseCaseError';

export namespace UpdatePaymentStatusErrors {
  export class CannotRetrievePaymentError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'Error al intentar obtener el pago de la base de datos.'
      } as UseCaseError);
    }
  }

  export class CannotRetrievePurchaseOrderError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message:
          'Error al intentar obtener la orden de compra de la base de datos.'
      } as UseCaseError);
    }
  }

  export class PaymentButtonResponseError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'Error al conectarse con el botón de pagos.'
      } as UseCaseError);
    }
  }

  export class PaymentNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message:
          'El ID de compra no ha sido encontrado en nuestra base de datos.'
      } as UseCaseError);
    }
  }
}
