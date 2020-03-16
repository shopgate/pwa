import React from 'react';
import { mount } from 'enzyme';
import { getThemeSettings } from '../../../../core';
import { getAvailabilitySettings } from '../../../helpers';
import { StockInfo } from '../StockInfo';

jest.mock('../../../../core', () => ({
  ...jest.requireActual('../../../../core'),
  getThemeSettings: jest.fn(),
}));
jest.mock('../../../helpers', () => ({
  getAvailabilitySettings: jest.fn(),
}));

describe('<StockInfo />', () => {
  it('should render with the visible inventory and with the store name', () => {
    getThemeSettings.mockReturnValueOnce({});
    getAvailabilitySettings.mockReturnValueOnce({
      availabilityText: 'demo_availability_text',
      availabilityTextColor: 'green',
    });
    const wrapper = mount(<StockInfo
      location={{
        name: 'Test Store',
      }}
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without store name', () => {
    getThemeSettings.mockReturnValueOnce({});
    getAvailabilitySettings.mockReturnValueOnce({
      availabilityText: 'demo_availability_text',
      availabilityTextColor: 'green',
    });
    const wrapper = mount(<StockInfo
      location={{
        name: 'Test Store',
      }}
      showStoreName={false}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[string="product.location_stock_info.pick_up_at"]').length).toBe(0);
  });

  it('should render without the visible inventory', () => {
    getThemeSettings.mockReturnValueOnce({});
    getAvailabilitySettings.mockReturnValueOnce({
      availabilityText: 'demo_availability_text',
      availabilityTextColor: 'green',
    });
    const wrapper = mount(<StockInfo
      location={{
        name: 'Test Store',
      }}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[string="demo_availability_text"]').length).toBe(0);
  });
});
