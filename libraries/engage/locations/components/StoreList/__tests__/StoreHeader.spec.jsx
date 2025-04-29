import React from 'react';
import { mount } from 'enzyme';
import { FulfillmentContext } from '../../../locations.context';
import { StoreContext } from '../Store.context';
import { StoreHeader } from '../StoreHeader';

const context = {
  selectLocation: jest.fn(),
};

jest.mock('../../../helpers', () => ({
  isProductAvailable: jest.fn().mockReturnValue(true),
}));
jest.mock('@shopgate/engage/components');

jest.mock('../../StockInfo', () => ({
  StockInfo: () => null,
}));
jest.mock('../StoreSelectLocationButton', () => ({
  StoreSelectLocationButton: () => null,
}));

describe('engage > locations > StoreList > StoreHeader', () => {
  const store = {
    code: 'store',
    name: 'SomeStore',
    distance: 0.02,
    unitSystem: 'metric',
    operationHours: {
      mon: '8:00am - 4:00pm',
      tue: '8:00am - 4:00pm',
      wed: '8:00am - 4:00pm',
      thu: '8:00am - 4:00pm',
      fri: '8:00am - 4:00pm',
      sat: '8:00am - 4:00pm',
      sun: '8:00am - 4:00pm',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected', () => {
    const wrapper = mount((
      <FulfillmentContext.Provider value={context}>
        <StoreContext.Provider value={store}>
          <StoreHeader />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
