import React from 'react';
import { shallow } from 'enzyme';
import PriceSlider from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/filter', () => ({
  FilterItem: ({ children }) => children,
}));

describe('Filter: <PriceSlider />', () => {
  it('should render with default props', () => {
    const wrapper = shallow(<PriceSlider id="foo" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with custom props', () => {
    const wrapper = shallow(<PriceSlider id="foo" values={[5, 50]} />);
    expect(wrapper).toMatchSnapshot();
  });
});
