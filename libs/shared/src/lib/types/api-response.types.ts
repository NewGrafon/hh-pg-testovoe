export type ResponseItem<T> = {
  success: boolean;
  item: T;
  message?: string;
};

export type ResponseItems<T> = {
  success: boolean;
  items: T[];
  message?: string;
};
