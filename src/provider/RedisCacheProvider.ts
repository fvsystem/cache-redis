import { CacheTemplate, Data, SaveOptions } from '@fvsystem/cache-template';
import Redis, { RedisOptions } from 'ioredis';
import debug from 'debug';

const log = debug('fvsytem-template-cache');

export default class RedisCacheProvider implements CacheTemplate {
  private client: Redis;

  constructor(options: RedisOptions) {
    this.client = new Redis(options);
  }

  async save(
    value: Data<unknown>,
    prefix: string,
    options?: SaveOptions
  ): Promise<void> {
    log(
      'RedisCacheProvider.save value %O prefix &s ttl %O',
      value,
      prefix,
      options
    );
    if (options?.ttlInSeconds) {
      await this.client.set(
        `${prefix}${value.key}`,
        JSON.stringify(value.data),
        'EX',
        options.ttlInSeconds
      );
      return;
    }
    await this.client.set(`${prefix}${value.key}`, JSON.stringify(value.data));
  }

  async recover<T = unknown>(key: string, prefix: string): Promise<T | null> {
    log('RedisCacheProvider.recover key %s prefix &s', key, prefix);
    const value = await this.client.get(`${prefix}${key}`);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async invalidate(key: string, prefix: string): Promise<void> {
    log('RedisCacheProvider.invalidate key %s prefix &s', key, prefix);
    await this.client.del(`${prefix}${key}`);
  }
}
