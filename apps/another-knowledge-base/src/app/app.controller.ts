import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@pvz-backends/auth-module';

@Controller()
@ApiTags()
@ApiBearerAuth('x-token')
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
