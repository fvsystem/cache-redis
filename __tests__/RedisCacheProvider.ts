import { Data } from '@fvsystem/cache-template';
import RedisCacheProvider from '../src/provider/RedisCacheProvider';

jest.mock('ioredis');

let redisCacheProvider: RedisCacheProvider;

describe('RedisCacheProvider', () => {
  beforeEach(() => {
    redisCacheProvider = new RedisCacheProvider({});
    jest.resetAllMocks();
  });

  it('should be abble to add and recover value', async () => {
    const data: Data<number> = {
      key: 'test',
      data: 1,
    };

    await redisCacheProvider.save(data, 'app:');

    const dataRecovered = await redisCacheProvider.recover<number>(
      'test',
      'app:'
    );

    expect(dataRecovered).toBe(1);
  });

  it('should be remove value after some time', async () => {
    const data: Data<number> = {
      key: 'test',
      data: 1,
    };

    jest.useFakeTimers();

    await redisCacheProvider.save(data, 'app:', { ttlInSeconds: 3 });

    const dataRecovered = await redisCacheProvider.recover<number>(
      'test',
      'app:'
    );

    expect(dataRecovered).toBe(1);

    jest.runAllTimers();

    const newDataRecovered = await redisCacheProvider.recover<number>(
      'test',
      'app:'
    );

    expect(newDataRecovered).toBe(null);
  });

  it('should invalidate Key', async () => {
    const value: Data<number> = {
      key: 'test',
      data: 1,
    };

    await redisCacheProvider.save(value, 'app:');

    const dataRecovered = await redisCacheProvider.recover<number>(
      'test',
      'app:'
    );

    expect(dataRecovered).toEqual(1);

    await redisCacheProvider.invalidate('test', 'app:');

    const newDataRecovered = await redisCacheProvider.recover<number>(
      'test',
      'app:'
    );

    expect(newDataRecovered).toBe(null);
  });
});
