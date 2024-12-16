import { Timestamp } from 'typeorm';

export interface PayloadInterface {
  id: number;
  email: string;
  deleted: Date | Timestamp;
}

export type UserFromPayloadInterface = PayloadInterface;
