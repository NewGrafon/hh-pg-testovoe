export const DB_USER_AUTH_KEY: Function = (id: number, email: string) => {
  return `user_auth_id:${id}_email:${email}`;
};
