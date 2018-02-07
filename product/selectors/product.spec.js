/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getProductProperties,
} from './product';
import {
  PROPERTIES_FILTER_BLACKLIST,
  PROPERTIES_FILTER_WHITELIST,
} from '../constants/';

let mockedConfig;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get productPropertiesFilter() {
    return mockedConfig;
  },
}));

const property1 = {
  label: 'Article No.',
  value: '9252529931',
};
const property2 = {
  label: 'Manufacturer',
  value: 'Nike',
};

let mockedState = {
  product: {
    currentProduct: {
      productId: 'product1',
    },
    propertiesByProductId: {
      product1: {
        isFetching: false,
        properties: [
          property1,
          property2,
        ],
      },
    },
  },
};

describe('Product selectors', () => {
  beforeEach(() => {
    // Deepcopy
    mockedState = JSON.parse(JSON.stringify(mockedState));
  });

  it('should get whitelisted properties', () => {
    mockedConfig = {
      type: PROPERTIES_FILTER_WHITELIST,
      properties: [property1.label],
    };

    const properties = getProductProperties(mockedState);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).toEqual(property1.label);
    expect(properties[0].label).not.toEqual(property2.label);
  });

  it('should not get blacklisted properties', () => {
    mockedConfig = {
      type: PROPERTIES_FILTER_BLACKLIST,
      properties: [property1.label],
    };
    const properties = getProductProperties(mockedState);
    expect(properties.length).toEqual(1);
    expect(properties[0].label).not.toEqual(property1.label);
    expect(properties[0].label).toEqual(property2.label);
  });

  it('should not filter with invalid type', () => {
    mockedConfig = {
      type: 'foo',
      properties: [property1.label],
    };

    const properties = getProductProperties(mockedState);
    expect(properties.length).toEqual(2);
    expect(properties).toEqual([
      property1,
      property2,
    ]);
  });

  it('should not filter when no config is set', () => {
    mockedConfig = null;

    const properties = getProductProperties(mockedState);
    expect(properties.length).toEqual(2);
    expect(properties).toEqual([
      property1,
      property2,
    ]);
  });
  it('should filter all when whitelist is empty array', () => {
    mockedConfig = {
      type: PROPERTIES_FILTER_WHITELIST,
      properties: [],
    };
    const properties = getProductProperties(mockedState);
    expect(properties.length).toEqual(0);
  });
  it('should pass all when blacklist is empty array', () => {
    mockedConfig = {
      type: PROPERTIES_FILTER_BLACKLIST,
      properties: [],
    };
    const properties = getProductProperties(mockedState);
    expect(properties.length).toEqual(2);
  });
});
