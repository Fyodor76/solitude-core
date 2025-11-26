export class AttributeValueEntity {
  constructor(
    public id: string,
    public attributeId: string,
    public value: string,
    public slug: string,
    public sortOrder: number = 0,
    public isActive: boolean = true,
    public hexCode?: string,
    public metadata: Record<string, any> = {},
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

  updateValue(newValue: string, newSlug: string): void {
    this.value = newValue;
    this.slug = newSlug;
    this.updatedAt = new Date();
  }

  updateHexCode(newHexCode: string): void {
    this.hexCode = newHexCode;
    this.updatedAt = new Date();
  }
}
