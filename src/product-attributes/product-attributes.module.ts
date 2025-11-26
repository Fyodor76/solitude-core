import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttributeApplication } from './application/product-attribute.service';
import { SequelizeProductAttributeRepository } from './infrastructure/repositories/sequelize-product-attribute.repository';
import { ProductAttributeModel } from './infrastructure/orm/product-attribute.entity';
import { AttributeValueModel } from './infrastructure/orm/attribute-value.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductAttributeModel, AttributeValueModel]),
  ],
  providers: [
    ProductAttributeApplication,
    {
      provide: 'ProductAttributeRepository',
      useClass: SequelizeProductAttributeRepository,
    },
  ],
  controllers: [ProductAttributesController],
  exports: ['ProductAttributeRepository'],
})
export class ProductAttributesModule {}
