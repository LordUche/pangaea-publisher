import { CustomError } from './custom-error';

export class PublishFailError extends CustomError {
  statusCode = 500;

  constructor(reason?: string) {
    super(reason || 'Publish failed');

    Object.setPrototypeOf(this, PublishFailError.prototype);
  }
}
