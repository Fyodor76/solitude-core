import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test } from './tests.entity';
import { TestService } from './tests.service';
import { TestController } from './tests.controller';
import { QuestionsModule } from '../questions/question.module';
import { Question } from '../questions/questions.entity';

@Module({
  imports: [SequelizeModule.forFeature([Test, Question]), QuestionsModule],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestsModule {}
