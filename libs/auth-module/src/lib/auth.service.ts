import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvTransformedValues } from '@pvz-backends/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {
    if (!EnvTransformedValues().production().value) {
      setTimeout(() => {
        const exampleUser = {
          id: 1,
          email: 'email@example.com'
        };
        console.log(
          `--- test jwt token (because prod mode disabled) ---\n`,
          this.jwtService.sign(exampleUser, {
            secret: EnvTransformedValues().secret_word().value,
            expiresIn: EnvTransformedValues().expires_in().value
          }),
          // @ts-ignore // shitty code damn......
          `\n--- user example: ${JSON.stringify(exampleUser, null, 2).replaceAll('\n', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ')} ---`,
        );
      }, 250);
    }
  }
}
