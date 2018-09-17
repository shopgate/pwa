import {
  FILTER_TYPE_SINGLE_SELECT,
  FILTER_TYPE_MULTISELECT,
  FILTER_TYPE_RANGE,
} from '@shopgate/pwa-common-commerce/filter/constants';
import buildRequestFilters from './buildRequestFilters';

const input = {
  display_amount: {
    id: 'display_amount',
    label: 'Price',
    type: FILTER_TYPE_RANGE,
    value: [1337, 4711],
  },
  manufacturer: {
    id: 'manufacturer',
    label: 'Manufacturer Label',
    source: 'manufacturer',
    type: FILTER_TYPE_MULTISELECT,
    value: [{
      id: 'With+special+characters',
      label: 'With special characters',
    }, {
      id: 'Some Id',
      label: 'Label of some id',
    }],
  },
  'Single Select Filter': {
    id: 'Single Select Filter',
    label: 'Single Select Filter Label',
    source: 'properties',
    type: FILTER_TYPE_SINGLE_SELECT,
    value: [{
      id: 'Value One ID',
      label: 'Value One Label',
    }],
  },
};

const output = {
  display_amount: {
    label: 'Price',
    minimum: 1337,
    maximum: 4711,
    type: FILTER_TYPE_RANGE,
  },
  manufacturer: {
    label: 'Manufacturer Label',
    source: 'manufacturer',
    type: FILTER_TYPE_MULTISELECT,
    values: ['With+special+characters', 'Some Id'],
  },
  'Single Select Filter': {
    label: 'Single Select Filter Label',
    source: 'properties',
    type: FILTER_TYPE_SINGLE_SELECT,
    value: 'Value One ID',
  },
};

describe('buildRequestFilters()', () => {
  it('should build the filters as expected', () => {
    expect(buildRequestFilters(input)).toEqual(output);
  });

  it('should return undefined when no valid filters are passed', () => {
    expect(buildRequestFilters(null)).toBeUndefined();
  });

  it('should return an empty object if empty filters are passed', () => {
    expect(buildRequestFilters({})).toEqual({});
  });
});
