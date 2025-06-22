import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test } from './tests.entity';
import { TestService } from './tests.service';
import { TestController } from './tests.controller';
import { QuestionsModule } from 'src/questions/question.module';

@Module({
  imports: [SequelizeModule.forFeature([Test]), QuestionsModule],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestsModule {}
