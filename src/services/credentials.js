import { Register } from '@di';

export const CREDENTIALS_SERVICE_ID = Symbol('credentialsService');

@Register(CREDENTIALS_SERVICE_ID)
export default class CredentialsService {
  sanitize (input) {
    if (input && input.trim) {
      return input.trim();
    } else {
      return input;
    }
  }
}
