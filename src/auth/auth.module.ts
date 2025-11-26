import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthApplication } from './application/auth.service';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/redis/redis.module';
import { TokenModule } from 'src/common/redis/token.module';

@Module({
  imports: [UsersModule, RedisModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthApplication],
})
export class AuthModule {}
