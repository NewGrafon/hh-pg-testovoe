import { ExceptionMessages, ResponseItem, ResponseItems } from '@pvz-backends/shared';

export const UnauthorizedResponseItem: ResponseItem<any> = {
  success: false,
  item: null,
  message: ExceptionMessages.Unauthorized,
} as const;

export const UnauthorizedResponseItems: ResponseItems<any> = {
  success: false,
  items: [],
  message: ExceptionMessages.Unauthorized,
} as const;
