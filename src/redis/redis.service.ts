import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { tryCatch } from 'src/common/utils/try-catch.helper';
import { throwInternal } from 'src/common/exceptions/http-exception.helper';
import { AppLogger } from 'src/common/logger/app-logger.service';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(RedisService.name);
  }

  /**
   * Устанавливает значение по ключу с TTL
   * @param key Ключ
   * @param value Значение
   * @param ttl Время жизни в секундах
   * @returns true если успешно, иначе false
   */
  async set(key: string, value: string, ttl: number): Promise<boolean> {
    return tryCatch(async () => {
      const result = await this.redisClient.set(key, value, 'EX', ttl);
      if (result !== 'OK') {
        this.logger.error(
          `Failed to set key "${key}". Redis response: ${result}`,
        );
        return false;
      }
      this.logger.log(`Set key "${key}" with TTL ${ttl}`);
      return true;
    }, 'RedisService:set');
  }

  /**
   * Получает значение по ключу
   * @param key Ключ
   * @returns Значение или null если нет
   */
  async get(key: string): Promise<string | null> {
    return tryCatch(async () => {
      const value = await this.redisClient.get(key);
      if (value === null) {
        this.logger.warn(`Key "${key}" not found in Redis.`);
      } else {
        this.logger.log(`Got key "${key}" from Redis.`);
      }
      return value;
    }, 'RedisService:get');
  }

  /**
   * Удаляет ключ из Redis
   * @param key Ключ
   * @returns true если ключ удален, false если ключ не найден
   */
  async del(key: string): Promise<boolean> {
    return tryCatch(async () => {
      const result = await this.redisClient.del(key);
      if (result === 0) {
        this.logger.warn(`Key "${key}" not found for deletion.`);
        return false;
      }
      this.logger.log(`Deleted key "${key}" from Redis.`);
      return true;
    }, 'RedisService:del');
  }

  /**
   * Получить список ключей по паттерну
   * @param pattern Паттерн ключей, например '*'
   * @returns Массив ключей
   */
  async keys(pattern: string): Promise<string[]> {
    return tryCatch(async () => {
      const keys = await this.redisClient.keys(pattern);
      if (keys.length === 0) {
        this.logger.warn(`No keys found matching pattern "${pattern}".`);
      } else {
        this.logger.log(
          `Found ${keys.length} keys matching pattern "${pattern}".`,
        );
      }
      return keys;
    }, 'RedisService:keys');
  }

  /**
   * Создает SHA256 хэш от переданного значения
   * @param value Строка для хэширования
   * @returns Хэш в hex-формате
   */
  hash(value: string): string {
    try {
      const hash = crypto.createHash('sha256').update(value).digest('hex');
      this.logger.debug(`Hashed value "${value}"`);
      return hash;
    } catch (error) {
      this.logger.error(
        `Error while hashing value: ${error.message}`,
        error.stack,
      );
      throwInternal(error, 'Failed to hash value.');
    }
  }
}
