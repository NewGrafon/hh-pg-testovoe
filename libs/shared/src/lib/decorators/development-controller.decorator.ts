import { SetMetadata } from '@nestjs/common';

export const IS_DEVELOPMENT_CONTROLLER = 'isDevelopmentControllerPath';
export const IsDevController = () =>
  SetMetadata(IS_DEVELOPMENT_CONTROLLER, true);
