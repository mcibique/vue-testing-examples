import axios from 'axios';
import { Register } from '@di';

export const EMAIL_SERVICE_ID = Symbol('emailService');

@Register(EMAIL_SERVICE_ID)
export default class EmailService {
  getEmails () {
    return axios.get('/api/emails').then(response => response.data);
  }
}
