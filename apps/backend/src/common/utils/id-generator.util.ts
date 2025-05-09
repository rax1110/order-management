import { v4 as uuid4 } from 'uuid';

export class IdGenerator {
  private static readonly ID_LENGTH = 10;

  static async generateUniqueId(): Promise<string> {
    // Generate a UUID and take the first part for simplicity
    const id = uuid4().replace(/-/g, '').substring(0, IdGenerator.ID_LENGTH).toUpperCase();

    return id;
  }
} 