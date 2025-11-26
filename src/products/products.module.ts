import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products.controller';
import { ProductApplication } from './application/product.service';
import { SequelizeProductRepository } from './infrastructure/repositories/sequelize-product.repository';
import { ProductModel } from './infrastructure/orm/product.entity';
import { ProductVariationModel } from './infrastructure/orm/product-variation.entity';
import { VariationAttributeModel } from './infrastructure/orm/variation-attribute.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductAttributeLinkModel } from './infrastructure/orm/product-attribute-link.entity';
import { ProductAttributesModule } from 'src/product-attributes/product-attributes.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductModel,
      ProductVariationModel,
      ProductAttributeLinkModel,
      VariationAttributeModel,
    ]),
    ProductAttributesModule,
    CategoriesModule,
  ],
  providers: [
    ProductApplication,
    {
      provide: 'ProductRepository',
      useClass: SequelizeProductRepository,
    },
  ],
  controllers: [ProductsController],
  exports: ['ProductRepository'],
})
export class ProductsModule {}
