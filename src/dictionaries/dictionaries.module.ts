import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DictionariesController } from './dictionaries.controller';
import { DictionaryApplication } from './application/dictionary.service';
import { SequelizeDictionaryRepository } from './infrastructure/repositories/sequelize-dictionary.repository';
import { DictionaryModel } from './infrastructure/orm/dictionary.entity';

@Module({
  imports: [SequelizeModule.forFeature([DictionaryModel])],
  providers: [
    DictionaryApplication,
    {
      provide: 'DictionaryRepository',
      useClass: SequelizeDictionaryRepository,
    },
  ],
  controllers: [DictionariesController],
  exports: ['DictionaryRepository'],
})
export class DictionariesModule {}
