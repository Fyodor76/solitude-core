import { throwBadRequest } from 'src/common/exceptions/http-exception.helper';

export class ProductEntity {
  private _variations: ProductVariation[] = [];

  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
    public description: string,
    public price: number,
    public comparePrice: number | null = null,
    public categoryId: string,
    public brand: string,
    public material: string,
    public sku: string,
    public isActive: boolean = true,
    public isFeatured: boolean = false,
    public inStock: boolean = true,
    public images: string[] = [],
    public attributes: ProductAttribute[] = [],
    variations: ProductVariation[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this._variations = variations;
    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push('Product name is required');
    }

    if (!this.slug?.trim()) {
      errors.push('Product slug is required');
    }

    if (this.slug.includes(' ')) {
      errors.push('Product slug cannot contain spaces');
    }

    if (this.price < 0) {
      errors.push('Product price cannot be negative');
    }

    if (this.comparePrice !== null && this.comparePrice < 0) {
      errors.push('Compare price cannot be negative');
    }

    if (this.comparePrice !== null && this.comparePrice <= this.price) {
      errors.push('Compare price must be greater than regular price');
    }

    if (!this.categoryId?.trim()) {
      errors.push('Category is required');
    }

    if (!this.brand?.trim()) {
      errors.push('Brand is required');
    }

    if (!this.sku?.trim()) {
      errors.push('SKU is required');
    }

    const allSkus = [this.sku, ...this._variations.map((v) => v.sku)];
    const uniqueSkus = new Set(allSkus);
    if (uniqueSkus.size !== allSkus.length) {
      errors.push('SKU must be unique across product and its variations');
    }

    // if (this.images.some((img) => !this.isValidUrl(img))) {
    //   errors.push('All product images must be valid URLs');
    // }

    if (errors.length > 0) {
      throwBadRequest(`Product validation failed: ${errors.join(', ')}`);
    }
  }

  get variations(): ReadonlyArray<ProductVariation> {
    return [...this._variations];
  }

  addVariation(variation: ProductVariation): void {
    if (this._variations.some((v) => v.sku === variation.sku)) {
      throw new Error('Variation with this SKU already exists');
    }

    if (this.sku === variation.sku) {
      throw new Error('Variation SKU cannot be the same as product SKU');
    }

    this._variations.push(variation);
    this.updatedAt = new Date();
    this.validate();
  }

  removeVariation(variationId: string): void {
    this._variations = this._variations.filter((v) => v.id !== variationId);
    this.updatedAt = new Date();
  }

  findVariation(variationId: string): ProductVariation | undefined {
    return this._variations.find((v) => v.id === variationId);
  }

  updateVariation(
    variationId: string,
    updatedVariation: ProductVariation,
  ): void {
    const index = this._variations.findIndex((v) => v.id === variationId);
    if (index === -1) {
      throw new Error('Variation not found');
    }

    if (
      this._variations.some(
        (v, i) => i !== index && v.sku === updatedVariation.sku,
      )
    ) {
      throw new Error('Variation with this SKU already exists');
    }

    if (this.sku === updatedVariation.sku) {
      throw new Error('Variation SKU cannot be the same as product SKU');
    }

    this._variations[index] = updatedVariation;
    this.updatedAt = new Date();
    this.validate();
  }

  updatePrice(newPrice: number, newComparePrice?: number | null): void {
    const originalPrice = this.price;
    const originalComparePrice = this.comparePrice;

    this.price = newPrice;
    this.comparePrice =
      newComparePrice !== undefined ? newComparePrice : this.comparePrice;

    try {
      this.validate();
      this.updatedAt = new Date();
    } catch (error) {
      this.price = originalPrice;
      this.comparePrice = originalComparePrice;
      throw error;
    }
  }

  updateInfo(name: string, description: string): void {
    const originalName = this.name;
    const originalDescription = this.description;

    this.name = name;
    this.description = description;

    try {
      this.validate();
      this.updatedAt = new Date();
    } catch (error) {
      this.name = originalName;
      this.description = originalDescription;
      throw error;
    }
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  hasVariations(): boolean {
    return this._variations.length > 0;
  }

  getTotalStock(): number {
    return this._variations.reduce(
      (total, variation) => total + variation.stock,
      0,
    );
  }

  isInStock(): boolean {
    return this.inStock || this.getTotalStock() > 0;
  }
}

export class ProductAttribute {
  constructor(
    public attributeId: string,
    public values: string[],
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.attributeId?.trim()) {
      throw new Error('Attribute ID is required');
    }
    if (!Array.isArray(this.values)) {
      throw new Error('Value slugs must be an array');
    }
    if (this.values.length === 0) {
      throw new Error('At least one value must be selected');
    }
  }
}

export class ProductVariation {
  constructor(
    public readonly id: string,
    public sku: string,
    public price: number,
    public comparePrice: number | null = null,
    public stock: number = 0,
    public images: string[] = [],
    public attributes: VariationAttribute[] = [],
    public isActive: boolean = true,
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.sku?.trim()) {
      errors.push('Variation SKU is required');
    }

    if (this.price < 0) {
      errors.push('Variation price cannot be negative');
    }

    if (this.comparePrice !== null && this.comparePrice < 0) {
      errors.push('Variation compare price cannot be negative');
    }

    if (this.stock < 0) {
      errors.push('Variation stock cannot be negative');
    }

    if (errors.length > 0) {
      throw new Error(
        `ProductVariation validation failed: ${errors.join(', ')}`,
      );
    }
  }

  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.stock = newStock;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }
}

export class VariationAttribute {
  constructor(
    public attributeId: string,
    public values: string[],
  ) {}
}
