import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { createDatabaseConfig } from './config/databaseConfig';
import { TestsModule } from './tests/tests.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Test } from './tests/tests.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User, Test]),
    TestsModule,
    UsersModule,
  ],
})
export class AppModule {}
