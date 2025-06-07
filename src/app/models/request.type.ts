import { RequestType } from './request-type.type';

export interface Request {
  name: string;
  phone: string;
  service?: string;
  type: RequestType;
}
