import { AttributeValueEntity } from './attribute-value.entity';

export enum AttributeType {
  COLOR = 'color',
  SIZE = 'size',
  VOLUME = 'volume',
  WEIGHT = 'weight',
  DIMENSION = 'dimension',
  OTHER = 'other',
}

export class ProductAttributeEntity {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public type: AttributeType,
    public description: string = '',
    public isActive: boolean = true,
    public sortOrder: number = 0,
    public values: AttributeValueEntity[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    if (!this.name?.trim()) {
      errors.push('Attribute name is required');
    }
    if (!this.slug?.trim()) {
      errors.push('Attribute slug is required');
    }
    if (this.slug.includes(' ')) {
      errors.push('Attribute slug cannot contain spaces');
    }

    if (errors.length > 0) {
      throw new Error(
        `ProductAttribute validation failed: ${errors.join(', ')}`,
      );
    }
  }

  updateSortOrder(newOrder: number): void {
    this.sortOrder = newOrder;
    this.updatedAt = new Date();
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  updateInfo(name: string, description: string): void {
    const originalName = this.name;
    this.name = name;
    this.description = description;

    try {
      this.validate();
      this.updatedAt = new Date();
    } catch (error) {
      this.name = originalName;
      throw error;
    }
  }
}
