import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from '@app/common/modules/redis/redis.repository';
import { REDIS_PREFIX } from '@app/common/modules/redis/redis-prefix.enum';

const threeDayInSeconds = 3 * 60 * 60 * 24;
const tenMinutesInSeconds = 60 * 10;

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async saveVerificationSession(
    userId: number,
    sessionData: any,
  ): Promise<void> {
    await this.redisRepository.setWithExpiry(
      REDIS_PREFIX.VERIFICATION_SESSION,
      userId.toString(),
      JSON.stringify(sessionData),
      tenMinutesInSeconds,
    );
  }

  async saveResetPasswordSession(
    sessionId: string,
    sessionData: any,
  ): Promise<void> {
    await this.redisRepository.setWithExpiry(
      REDIS_PREFIX.RESET_PASSWORD_SESSION,
      sessionId,
      JSON.stringify(sessionData),
      tenMinutesInSeconds,
    );
  }

  async saveLogInSession(sessionId: string, sessionData: any): Promise<void> {
    await this.redisRepository.setWithExpiry(
      REDIS_PREFIX.USER_SESSION,
      sessionId,
      JSON.stringify(sessionData),
      threeDayInSeconds,
    );
  }

  async getVerificationSession(userId: number): Promise<any | null> {
    const session = await this.redisRepository.get(
      REDIS_PREFIX.VERIFICATION_SESSION,
      userId.toString(),
    );
    return JSON.parse(session);
  }

  async getResetPasswordSession(sessionId: string): Promise<any | null> {
    const session = await this.redisRepository.get(
      REDIS_PREFIX.RESET_PASSWORD_SESSION,
      sessionId,
    );
    return JSON.parse(session);
  }

  async getLogInSession(sessionId: string): Promise<any | null> {
    return JSON.parse(
      await this.redisRepository.get(REDIS_PREFIX.USER_SESSION, sessionId),
    );
  }

  async deleteLogInSession(sessionId: string): Promise<void> {
    return await this.redisRepository.delete(
      REDIS_PREFIX.USER_SESSION,
      sessionId,
    );
  }

  async deleteVerificationSession(sessionId: string): Promise<void> {
    return await this.redisRepository.delete(
      REDIS_PREFIX.VERIFICATION_SESSION,
      sessionId,
    );
  }

  async deletePasswordResetSession(sessionId: string): Promise<void> {
    return await this.redisRepository.delete(
      REDIS_PREFIX.RESET_PASSWORD_SESSION,
      sessionId,
    );
  }

  async saveUser2FASecret(sessionId: string, secret: any): Promise<void> {
    await this.redisRepository.setWithExpiry(
      REDIS_PREFIX.USER_2FA,
      sessionId,
      JSON.stringify(secret),
      tenMinutesInSeconds,
    );
  }

  async getUser2FASecret(sessionId: string): Promise<any | null> {
    const session = await this.redisRepository.get(
      REDIS_PREFIX.USER_2FA,
      sessionId,
    );
    return JSON.parse(session);
  }

  async deleteUser2FASecret(sessionId: string): Promise<any | null> {
    await this.redisRepository.delete(REDIS_PREFIX.USER_2FA, sessionId);
  }
}
