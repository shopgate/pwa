/* eslint-disable camelcase */
import cloneDeep from 'lodash/cloneDeep';
import buildFilterParamsForFetchFiltersRequest from '../buildFilterParamsForFetchFiltersRequest';

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

describe('buildFilterParamsForFetchFiltersRequest()', () => {
  it('should return null when invoked with null', () => {
    expect(buildFilterParamsForFetchFiltersRequest(null)).toBe(null);
  });

  it('should return null when invoked with undefined', () => {
    expect(buildFilterParamsForFetchFiltersRequest(undefined)).toBe(null);
  });

  it('should return null when invoked with an empty object', () => {
    expect(buildFilterParamsForFetchFiltersRequest({})).toBe(null);
  });

  it('should return null when invoked with an regular filter object', () => {
    expect(buildFilterParamsForFetchFiltersRequest(mockedFilter)).toBe(null);
  });

  it('should return a null when invoked with a filters object where useForFetchFilters is false', () => {
    const filter = cloneDeep(mockedFilter);

    filter.manufacturer.useForFetchFilters = false;

    expect(buildFilterParamsForFetchFiltersRequest(filter)).toBe(null);
  });

  it('should return the expected filter object with request filters when a complete filter is flagged', () => {
    const filter = cloneDeep(mockedFilter);

    filter.manufacturer.useForFetchFilters = true;

    expect(buildFilterParamsForFetchFiltersRequest(filter)).toEqual({
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
    });
  });

  it('should return the expected filter object with request filters when a just a single value is flagged', () => {
    const filter = cloneDeep(mockedFilter);

    filter.manufacturer.value[1].useForFetchFilters = true;

    expect(buildFilterParamsForFetchFiltersRequest(filter)).toEqual({
      manufacturer: {
        id: 'manufacturer',
        label: 'Manufacturer',
        type: 'multiselect',
        value: [{
          id: 'tyrell_corp',
          label: 'Tyrell Corporation',
        }],
      },
    });
  });

  it('should return the expected filter object with request filters when every value is flagged', () => {
    const filter = cloneDeep(mockedFilter);

    filter.manufacturer.value[0].useForFetchFilters = true;
    filter.manufacturer.value[1].useForFetchFilters = false;

    expect(buildFilterParamsForFetchFiltersRequest(filter)).toEqual({
      manufacturer: {
        id: 'manufacturer',
        label: 'Manufacturer',
        type: 'multiselect',
        value: [{
          id: 'wayland_corp',
          label: 'Weyland Corp',
        }],
      },
    });
  });
});

/* eslint-enable camelcase */
