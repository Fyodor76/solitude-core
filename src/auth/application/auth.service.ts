import { Inject, Injectable } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { UserRepository } from 'src/users/domain/repository/user.repository';
import { throwUnauthorized } from 'src/common/exceptions/http-exception.helper';
import { TokenService } from 'src/common/redis/token.service';
import { RedisService } from 'src/redis/redis.service';
import { REFRESH_TTL } from 'src/common/const/refresh.ttl';

@Injectable()
export class AuthApplication {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.userRepository.findByLogin(dto.login);

    if (!user) {
      throwUnauthorized('Wrong login or password');
    }

    const isPasswordValid = await user.checkPassword(dto.password);

    if (!isPasswordValid) {
      throwUnauthorized('Wrong login or password');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      user.id,
    );

    await this.redisService.set(
      `refresh_${user.id}`,
      refreshToken,
      REFRESH_TTL,
    );

    return { accessToken, refreshToken, user };
  }

  async refresh(rToken: string) {
    let payload: any;
    try {
      payload = this.tokenService.verifyToken(rToken);
    } catch (err) {
      throwUnauthorized('Invalid or expired refresh token');
    }

    const storedToken = await this.redisService.get(`refresh_${payload.sub}`);
    if (!storedToken || storedToken !== rToken) {
      throwUnauthorized('Refresh token not valid or expired');
    }

    const { accessToken, refreshToken } = this.tokenService.generateTokens(
      payload.sub,
    );

    await this.redisService.set(
      `refresh_${payload.sub}`,
      refreshToken,
      REFRESH_TTL,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.redisService.del(`refresh_${userId}`);

    return { message: 'Logged out successfully' };
  }
}
