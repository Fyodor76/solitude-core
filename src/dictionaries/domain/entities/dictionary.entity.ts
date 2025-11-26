export enum DictionaryType {
  SIZE = 'size',
  COLOR = 'color',
  MATERIAL = 'material',
  BRAND = 'brand',
  COUNTRY = 'country',
  OTHER = 'other',
}

export class DictionaryEntity {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public type: DictionaryType,
    public values: DictionaryValue[] = [],
    public isActive: boolean = true,
    public sortOrder: number = 0,
    public description: string = '',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  addValue(value: DictionaryValue): void {
    this.values.push(value);
    this.updatedAt = new Date();
  }

  removeValue(valueId: string): void {
    this.values = this.values.filter((v) => v.id !== valueId);
    this.updatedAt = new Date();
  }

  updateValue(valueId: string, newValue: Partial<DictionaryValue>): void {
    const value = this.values.find((v) => v.id === valueId);
    if (value) {
      Object.assign(value, newValue);
      this.updatedAt = new Date();
    }
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
    this.updatedAt = new Date();
  }

  updateSortOrder(newOrder: number): void {
    this.sortOrder = newOrder;
    this.updatedAt = new Date();
  }
}

export class DictionaryValue {
  constructor(
    public id: string,
    public value: string,
    public slug: string,
    public sortOrder: number = 0,
    public isActive: boolean = true,
    public metadata: Record<string, any> = {},
    public hexCode?: string,
    public createdAt: Date = new Date(),
  ) {}
}
