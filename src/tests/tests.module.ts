import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test } from './tests.entity';
import { TestService } from './tests.service';
import { TestController } from './tests.controller';

@Module({
  imports: [SequelizeModule.forFeature([Test])],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestsModule {}
