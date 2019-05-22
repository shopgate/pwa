import { getSubgroupsFromProperties } from '../../helpers/getSubgroupsFromProperties';

describe('engage > product > ProductProperties', () => {
  describe('getSubgroupsFromProperties()', () => {
    it('should return an empty array of no properties are passed', () => {
      const result = getSubgroupsFromProperties();
      expect(result.length).toBe(0);
    });

    it('should return an empty array if there are no groups included', () => {
      const result = getSubgroupsFromProperties([
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
      const result = getSubgroupsFromProperties([
        {
          label: 'test1',
          value: 'Test 1',
          subDisplayGroup: 'TestSubgroup',
        },
        {
          label: 'test2',
          value: 'Test 2',
          subDisplayGroup: 'TestSubgroup',
        },
      ]);
      expect(result.length).toBe(1);
      expect(result).toEqual(['TestSubgroup']);
    });
  });
});
