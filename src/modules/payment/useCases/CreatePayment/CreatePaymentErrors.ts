import { Result } from '@core/Result';
import { UseCaseError } from '@core/UseCaseError';

export namespace CreatePaymentErrors {
  export class CannotCreatePaymentError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'No se pudo crear el pago.'
      } as UseCaseError);
    }
  }

  export class CannotSaveOnDatabaseError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: 'Error al grabar el pago en la base de datos.'
      } as UseCaseError);
    }
  }
}
