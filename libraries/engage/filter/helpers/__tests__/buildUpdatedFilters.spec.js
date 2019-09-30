import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import buildUpdatedFilters from '../buildUpdatedFilters';

const mockedFilter = {
  display_amount: {
    id: 'display_amount',
    label: 'Price',
    type: 'range',
    value: [100, 2000],
  },
  manufacturer: {
    id: 'manufacturer',
    label: 'Manufacturer',
    type: 'multiselect',
    value: [{
      id: 'wayland_corp',
      label: 'Weyland Corp',
    }, {
      id: 'tyrell_corp',
      label: 'Tyrell Corporation',
    }],
  },
};

describe('buildUpdatedFilters()', () => {
  it('should update filters as expected', () => {
    const updated = cloneDeep(mockedFilter);
    expect(buildUpdatedFilters({}, updated)).toEqual(updated);
  });

  it('should exclude filters when they do not have values selected', () => {
    const initial = cloneDeep(mockedFilter);
    const updated = set(cloneDeep(mockedFilter), 'manufacturer.value', []);
    const { manufacturer, ...expected } = mockedFilter;
    expect(buildUpdatedFilters(initial, updated)).toEqual(expected);
  });

  it('should round the values of a display amount filter', () => {
    const initial = cloneDeep(mockedFilter);
    const updated = set(cloneDeep(mockedFilter), 'display_amount.value', [125, 1920]);
    expect(buildUpdatedFilters(initial, updated)).toEqual(mockedFilter);
  });

  it('should return null both parameters are empty objects', () => {
    expect(buildUpdatedFilters({}, {})).toBeNull();
  });
});
