import axios from 'axios';
import { authRequestInterceptor } from './auth-interceptor';

axios.interceptors.request.use(authRequestInterceptor);
