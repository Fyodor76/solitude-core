export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public description: string,
    public parentId: string | null,
    public imageId: string,
    public isActive: boolean = true,
    public sortOrder: number = 0,
    public type: CategoryType = CategoryType.CATEGORY,
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

  moveToParent(newParentId: string | null): void {
    this.parentId = newParentId;
    this.updatedAt = new Date();
  }

  isCollection(): boolean {
    return this.type === CategoryType.COLLECTION;
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  isRoot(): boolean {
    return this.parentId === null;
  }
}

export enum CategoryType {
  CATEGORY = 'category',
  COLLECTION = 'collection',
}
