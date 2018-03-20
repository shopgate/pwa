import { generateSortedHash, compareObjects } from './index';

describe('redux helpers', () => {
  describe('Generate hash from object', () => {
    it('should generate a hash', () => {
      const obj1 = {
        abc: 12,
        hij: 567,
        def: 345,
      };

      const obj2 = {
        abc: 12,
        hij: [
          'asdasd',
          'asdasdasd',
          {
            56: '34534',
            67: 'sdfdf',
            12: 'sdsdf',
          },
        ],
        def: 345,
      };

      expect(generateSortedHash(obj1)).toEqual('{"abc":12,"def":345,"hij":567}');
      expect(generateSortedHash(obj2)).toEqual('{"abc":12,"def":345,"hij":["asdasd","asdasdasd",{"12":"sdsdf","56":"34534","67":"sdfdf"}]}');
    });
  });

  describe('Compare objects', () => {
    const obj1 = {
      abc: 123,
      def: 456,
      hij: 789,
    };

    const obj2 = {
      abc: 123,
      def: 456,
      hij: 789,
    };

    const obj3 = {
      abc: 123,
      def: 456,
      xyz: 234, // DIFFERENT !!
    };

    it('should compare equal objects', () => {
      expect(compareObjects(obj1, obj2)).toEqual(true);
      expect(compareObjects(obj2, obj1)).toEqual(true);
    });

    it('should compare unequal objects', () => {
      expect(compareObjects(obj1, obj3)).toEqual(false);
      expect(compareObjects(obj2, obj3)).toEqual(false);
      expect(compareObjects(obj3, obj1)).toEqual(false);
      expect(compareObjects(obj3, obj2)).toEqual(false);
    });
  });
});
