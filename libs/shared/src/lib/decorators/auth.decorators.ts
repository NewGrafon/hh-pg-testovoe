import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const AllowAnonymous = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ONLY_ANON_KEY = 'onlyAnonymous';
export const OnlyAnonymous = () => SetMetadata(ONLY_ANON_KEY, true);
