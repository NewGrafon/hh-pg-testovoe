import { EnvTransformedValues } from '@testovoe/shared';

export function jwtConfigBuilderFunction() {
  return {
    global: true,
    imports: [],
    inject: [],
    useFactory: async () => {
      return {
        secret: EnvTransformedValues(process.env).secret_word().value,
        // ignoreExpiration: true,
        signOptions: {
          expiresIn: EnvTransformedValues(process.env).expires_in().value ?? '7 days'
        }
      };
    }
  };
}
