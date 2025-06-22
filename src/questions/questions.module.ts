import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './questions.entity';
import { QuestionService } from './questions.service';
import { QuestionController } from './questions.controller';

@Module({
  imports: [SequelizeModule.forFeature([Question])],
  providers: [QuestionService],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionsModule {}
