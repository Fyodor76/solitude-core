import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { UserModel } from '../users/infrastructure/orm/user.entity';
import { Chat } from 'src/widgets/chat/entitites/chat.entity';
import { Message } from 'src/widgets/chat/entitites/message.entity';
import { ChatParticipant } from 'src/widgets/chat/entitites/chat-participant.entity';
import { CategoryModel } from 'src/categories/infrastructure/orm/category.entity';
import { ProductAttributeModel } from 'src/product-attributes/infrastructure/orm/product-attribute.entity';
import { AttributeValueModel } from 'src/product-attributes/infrastructure/orm/attribute-value.entity';
import { ProductModel } from 'src/products/infrastructure/orm/product.entity';
import { ProductVariationModel } from 'src/products/infrastructure/orm/product-variation.entity';
import { VariationAttributeModel } from 'src/products/infrastructure/orm/variation-attribute.entity';
import { ProductAttributeLinkModel } from 'src/products/infrastructure/orm/product-attribute-link.entity';
import { FormSubmissionModel } from 'src/form-submissions/infrastructure/orm/form-submission.entity';

export const createDatabaseConfig = (
  configService: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: 'postgres',
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  models: [
    UserModel,
    Chat,
    Message,
    ChatParticipant,
    CategoryModel,
    ProductAttributeModel,
    AttributeValueModel,
    ProductModel,
    ProductVariationModel,
    VariationAttributeModel,
    ProductAttributeLinkModel,
    FormSubmissionModel,
  ],
  autoLoadModels: true,
  synchronize: true,
});
