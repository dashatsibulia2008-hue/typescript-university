import { Identifiable } from "./basic-contracts";

/**
 * Узагальнений контракт репозиторію з підтримкою типу ID та фільтрації
 */
export interface IRepository<T extends Identifiable<ID>, ID = string> {
  save(entity: T): Promise<void>;
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  findWhere(predicate: (item: T) => boolean): Promise<T[]>;
  delete(id: ID): Promise<boolean>;
}

/**
 * Універсальна реалізація сховища в пам'яті (Generic In-Memory Store)
 */
export class InMemoryRepository<T extends Identifiable<ID>, ID = string>
  implements IRepository<T, ID>
{
  private _items: Map<ID, T> = new Map();

  async save(entity: T): Promise<void> {
    this._items.set(entity.id, entity);
  }

  async findById(id: ID): Promise<T | null> {
    const item = this._items.get(id);
    return item ?? null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this._items.values());
  }

  /**
   * Завдання 4: Фільтрація записів за предикатом
   */
  async findWhere(predicate: (item: T) => boolean): Promise<T[]> {
    return Array.from(this._items.values()).filter(predicate);
  }

  async delete(id: ID): Promise<boolean> {
    return this._items.delete(id);
  }
}