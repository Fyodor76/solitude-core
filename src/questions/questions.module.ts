import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './questions.entity';
import { QuestionService } from './questions.service';

@Module({
  imports: [SequelizeModule.forFeature([Question])],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionsModule {}
