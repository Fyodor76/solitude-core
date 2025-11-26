export class ProductEntity {
  constructor(
    public id: string,
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
    public variations: ProductVariation[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  addVariation(variation: ProductVariation): void {
    this.variations.push(variation);
    this.updatedAt = new Date();
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  hasVariations(): boolean {
    return this.variations.length > 0;
  }
}

export class ProductAttribute {
  constructor(
    public attributeId: string,
    public values: string[],
  ) {}
}

export class ProductVariation {
  constructor(
    public id: string,
    public sku: string,
    public price: number,
    public comparePrice: number | null = null,
    public stock: number = 0,
    public images: string[] = [],
    public attributes: VariationAttribute[] = [],
    public isActive: boolean = true,
  ) {}

  updateStock(newStock: number): void {
    this.stock = newStock;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }
}

export class VariationAttribute {
  constructor(
    public attributeId: string,
    public valueSlug: string,
  ) {}
}
