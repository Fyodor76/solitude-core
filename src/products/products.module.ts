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
import { SkuValidator } from './application/validators/sku.validator';
import { CategoryValidator } from './application/validators/category.validator';
import { AttributeValidator } from './application/validators/attribute.validator';
import { VariationValidator } from './application/validators/variation.validator';
import { ProductValidator } from './application/validators/product.validator';

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
    SkuValidator,
    CategoryValidator,
    AttributeValidator,
    VariationValidator,
    ProductValidator,

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
