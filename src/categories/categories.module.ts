import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesController } from './categories.controller';
import { CategoryApplication } from './application/category.service';
import { SequelizeCategoryRepository } from './infrastructure/repositories/sequelize-category.repository';
import { CategoryModel } from './infrastructure/orm/category.entity';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  providers: [
    CategoryApplication,
    {
      provide: 'CategoryRepository',
      useClass: SequelizeCategoryRepository,
    },
  ],
  controllers: [CategoriesController],
  exports: ['CategoryRepository'],
})
export class CategoriesModule {}
