import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { createDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mailer/mailer.module';
import { ChatModule } from './widgets/chat/chat.module';
import { LoggerModule } from './common/logger/logger.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { ProductAttributesModule } from './product-attributes/product-attributes.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    MailModule,
    ChatModule,
    LoggerModule,
    RedisModule,
    AuthModule,
    CategoriesModule,
    FileStorageModule,
    DictionariesModule,
    ProductAttributesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
