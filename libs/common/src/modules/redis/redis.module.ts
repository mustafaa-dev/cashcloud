import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { RedisRepository } from '@app/common/modules/redis/redis.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // CacheModule.registerAsync(RedisOptions),
  ],
  providers: [
    RedisService,
    RedisRepository,
    {
      provide: 'RedisClient',
      useFactory: () => {
        const redisInstance = new Redis({
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        });

        redisInstance.on('error', (e) => {
          throw new Error(`Redis connection failed: ${e}`);
        });

        return redisInstance;
      },
      inject: [],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
