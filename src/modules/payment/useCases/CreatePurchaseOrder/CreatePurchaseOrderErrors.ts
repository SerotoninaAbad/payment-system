import { Result } from '@core/Result';
import { UseCaseError } from '@core/UseCaseError';

export namespace CreatePurchaseOrderErrors {
  export class CannotCreateBuyerError extends Result<UseCaseError> {
    constructor(
      error = 'No se pudo obtener o crear el comprador en la base de datos.'
    ) {
      super(false, {
        message: error
      } as UseCaseError);
    }
  }

  export class PurchaseOrderCreationError extends Result<UseCaseError> {
    constructor(error = 'Error al grabar la orden de compra.') {
      super(false, {
        message: error
      } as UseCaseError);
    }
  }
}
