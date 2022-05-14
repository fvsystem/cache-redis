/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
import { FakeCacheProvider } from '@fvsystem/cache-template';
import { RedisOptions } from 'ioredis';

class Redis {
  fakeCache: FakeCacheProvider;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: RedisOptions) {
    this.fakeCache = new FakeCacheProvider();
  }

  async set(
    key: string,
    value: string,
    ttlType?: string,
    ttl?: number
  ): Promise<'OK'> {
    if (ttl) {
      await this.fakeCache.save({ key, data: value }, '', {
        ttlInSeconds: ttl,
      });
      return 'OK';
    }
    await this.fakeCache.save({ key, data: value }, '');
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    const value = await this.fakeCache.recover<string>(key, '');
    return value || null;
  }

  async del(key: string): Promise<void> {
    await this.fakeCache.invalidate(key, '');
  }
}

export default Redis;

export { Redis, RedisOptions };
