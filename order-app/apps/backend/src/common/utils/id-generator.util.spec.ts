import { IdGenerator } from './id-generator.util';
import { v4 as uuid4 } from 'uuid';

jest.mock('uuid');

describe('IdGenerator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateUniqueId', () => {
    it('should generate a unique ID with the correct length', async () => {
      (uuid4 as jest.Mock).mockReturnValue('1234567890abcdef1234567890abcdef');
      
      const uniqueId = await IdGenerator.generateUniqueId();
      
      expect(uniqueId.length).toBe(10);
      expect(uniqueId).toBe('1234567890');
    });

    it('should return ID in uppercase', async () => {
      (uuid4 as jest.Mock).mockReturnValue('abcdef1234567890abcdef1234567890');
      
      const uniqueId = await IdGenerator.generateUniqueId();
      
      expect(uniqueId).toBe('ABCDEF1234');
      expect(uniqueId).toEqual(expect.stringMatching(/^[A-Z0-9]{10}$/));
    });

    it('should remove hyphens from the UUID', async () => {
      (uuid4 as jest.Mock).mockReturnValue('12345678-90ab-cdef-1234-567890abcdef');
      
      const uniqueId = await IdGenerator.generateUniqueId();
      
      expect(uniqueId.includes('-')).toBe(false);
      expect(uniqueId).toBe('1234567890');
    });
  });
}); 