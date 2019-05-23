import { getGroupsFromProperties } from '../../helpers/getGroupsFromProperties';

describe('engage > product > ProductProperties', () => {
  describe('getGroupsFromProperties()', () => {
    it('should return an empty array of no properties are passed', () => {
      const result = getGroupsFromProperties();
      expect(result.length).toBe(0);
    });

    it('should return an empty array if there are no groups included', () => {
      const result = getGroupsFromProperties([
        {
          label: 'test1',
          value: 'Test 1',
        },
        {
          label: 'test2',
          value: 'Test 2',
        },
      ]);
      expect(result.length).toBe(0);
    });

    it('should return an array including 1 group', () => {
      const result = getGroupsFromProperties([
        {
          label: 'test1',
          value: 'Test 1',
          displayGroup: 'TestGroup',
        },
        {
          label: 'test2',
          value: 'Test 2',
          displayGroup: 'TestGroup',
        },
      ]);
      expect(result.length).toBe(1);
      expect(result).toEqual(['TestGroup']);
    });
  });
});
