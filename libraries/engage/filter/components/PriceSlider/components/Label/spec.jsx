import React from 'react';
import { shallow } from 'enzyme';
import Label from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core');

describe('PriceSlider: <Label />', () => {
  it('should render', () => {
    const wrapper = shallow(<Label onChange={() => {}} priceLength="5" priceMax={999} priceMin={25} />);
    expect(wrapper).toMatchSnapshot();
  });
});
