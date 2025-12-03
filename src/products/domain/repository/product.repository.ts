import { ProductFiltersDto } from 'src/products/application/dto/product-filters.dto';
import { ProductEntity, ProductVariation } from '../entities/product.entity';

export interface ProductRepository {
  create(product: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity>;
  findBySku(sku: string): Promise<ProductEntity | null>;
  findVariationBySku(
    sku: string,
  ): Promise<{ productId: string; variationId: string } | null>;
  findBySlug(slug: string): Promise<ProductEntity>;
  findByCategory(categoryId: string): Promise<ProductEntity[]>;
  findByBrand(brand: string): Promise<ProductEntity[]>;
  findAll(filters?: ProductFiltersDto): Promise<ProductEntity[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
  delete(id: string): Promise<void>;

  createVariation(
    productId: string,
    variation: ProductVariation,
  ): Promise<ProductEntity>;
  updateVariation(
    productId: string,
    variation: ProductVariation,
  ): Promise<ProductEntity>;
  deleteVariation(
    productId: string,
    variationId: string,
  ): Promise<ProductEntity>;
}
