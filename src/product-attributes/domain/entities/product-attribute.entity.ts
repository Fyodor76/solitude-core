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
    public values: any[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  updateSortOrder(newOrder: number): void {
    this.sortOrder = newOrder;
    this.updatedAt = new Date();
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  updateInfo(name: string, description: string): void {
    this.name = name;
    this.description = description;
    this.updatedAt = new Date();
  }
}
