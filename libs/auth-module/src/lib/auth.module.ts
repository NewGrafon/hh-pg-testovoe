import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard.service';

@Module({
  controllers: [],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  imports: []
})
export class AuthModule {
}
