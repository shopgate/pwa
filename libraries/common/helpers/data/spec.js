import { assignObjectDeep } from './';
import { isObject } from '../validation';

describe('helpers/data', () => {
  describe('assignObjectDeep', () => {
    it('should merge simple objects correctly', () => {
      const modifier = {
        b: 0,
        c: null,
        d: undefined,
        g: 1.7,
        h: 'g',
        i: { x: 'x' },
        j: ['a', 'b'],
      };

      // Object to be mutated
      const actual = {
        a: 0,
        b: 1,
        c: 'abc',
        d: 'def',
        e: 'ghi',
        f: null,
        g: 1.6,
      };
      assignObjectDeep(actual, modifier, false);

      expect(actual).toEqual({
        a: 0,
        b: 0,
        c: null,
        d: undefined,
        e: 'ghi',
        f: null,
        g: 1.7,
        h: 'g',
        i: { x: 'x' },
        j: ['a', 'b'],
      });
    });

    it('should merge objects containing sub-objects correctly', () => {
      const modifier = {
        a: {
          x: 2,
          y: {
            i: 'first mod',
            k: 'new entry',
          },
        },
        b: 'c',
        c: undefined,
        d: { x: 'x' },
        e: ['a', 'b'],
      };

      // Object to be mutated
      const actual = {
        a: {
          x: 1,
          y: {
            i: 'first',
            j: 'second',
          },
        },
        b: {
          x: 2,
          y: {
            i: 'first',
            j: 'second',
          },
        },
      };
      assignObjectDeep(actual, modifier, false);

      expect(actual).toEqual({
        a: {
          x: 2,
          y: {
            i: 'first mod',
            j: 'second',
            k: 'new entry',
          },
        },
        b: 'c',
        c: undefined,
        d: { x: 'x' },
        e: ['a', 'b'],
      });
    });

    it('should merge objects containing arrays correctly', () => {
      /**
       * This comparator detects unique scalar types and objects containing an id
       * within the 'a' prop
       *
       * @param {string} path path
       * @param {*} prev prev
       * @param {*} next next
       * @returns {boolean}
       */
      const comparator = (path, prev, next) => {
        // Scalar types
        if (!isObject(prev) || !isObject(next)) {
          return prev === next;
        }

        // Object merge only occurring on array object-items within the 'a' prop
        if (path.startsWith('$.a.')) {
          return prev.id === next.id;
        }

        return false;
      };

      const modifier = {
        b: [1, 2, 3],
        a: [
          ['non-unique1', 'non-unique1'],
          'unique element',
          2,
          {
            id: 'custom-id-2',
            data: {
              x: null,
              y: {
                i: 'first',
                j: 'second mod',
                k: 'third',
              },
              z: 'new data entry',
            },
          },
          {
            id: 'custom-id-3',
            data: {
              x: 'a',
            },
          },
        ],
      };

      // Object to be mutated
      const actual = {
        a: [
          1,
          'unique element',
          {
            id: 'custom-id-1',
            data: {
              x: 1,
              y: {
                i: 'first',
                j: 'second',
              },
            },
          },
          {
            id: 'custom-id-2',
            data: {
              x: 1,
              y: {
                i: 'first',
                j: 'second',
              },
            },
          },
          ['non-unique1', 'non-unique1'],
        ],
        b: [0],
      };
      assignObjectDeep(actual, modifier, false, comparator, '$');

      expect(actual).toEqual({
        a: [
          1,
          'unique element',
          {
            id: 'custom-id-1',
            data: {
              x: 1,
              y: {
                i: 'first',
                j: 'second',
              },
            },
          },
          {
            id: 'custom-id-2',
            data: {
              x: null,
              y: {
                i: 'first',
                j: 'second mod',
                k: 'third',
              },
              z: 'new data entry',
            },
          },
          ['non-unique1', 'non-unique1'],
          ['non-unique1', 'non-unique1'],
          2,
          {
            id: 'custom-id-3',
            data: {
              x: 'a',
            },
          },
        ],
        b: [0, 1, 2, 3],
      });
    });
  });
});
