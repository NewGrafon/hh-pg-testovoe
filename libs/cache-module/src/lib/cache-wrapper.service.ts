/* eslint-disable @typescript-eslint/no-inferrable-types */

import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EnvTransformedValues, ResponseItem, ResponseItems } from '@testovoe/shared';

@Injectable()
export class CacheWrapperService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async get<T>(
    key: string
  ): Promise<ResponseItem<T> | ResponseItems<T> | null> {
    const cachedData = await this.cacheManager.get(key);

    if (cachedData) {
      try {
        const json = JSON.parse(<string>cachedData) as
          | ResponseItem<T>
          | ResponseItems<T>;
        if (json) {
          return json;
        } else {
          return null;
        }
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

  set<T>(
    key: string,
    value: ResponseItem<T> | ResponseItems<T>,
    ttl: number = 60
  ): Promise<void> {
    if (!EnvTransformedValues().redis_enabled().value) {
      ttl *= 1000; // локальное кэширование использует милисекунды вместо секунд
    }

    return this.cacheManager.set(key, JSON.stringify(value), ttl);
  }

  del(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }

  getAllKeys(): Promise<string[]> {
    return this.cacheManager.store.keys();
  }

  async deleteKeysWithStartString(startString: string): Promise<void> {
    const allKeys = (await this.getAllKeys()).filter((key) =>
      key.startsWith(startString)
    );
    if (allKeys.length > 0) {
      const promises = allKeys.map<Promise<void>>((key) => {
        return new Promise<void>((resolve) => {
          this.del(key).finally(() => resolve());
        });
      });
      await Promise.all(promises);
    }
  }
}
