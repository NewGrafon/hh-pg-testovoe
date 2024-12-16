export interface IEnvReturnedMessage<T> {
  type: 'error' | 'warning' | 'info' | 'success';
  message?: string;
  value: T;
}

