import React from 'react';
import { mount } from 'enzyme';
import ProductsContent from './index';

describe('<ProductsContent />', () => {
  it('should render', () => {
    const wrapper = mount(<ProductsContent categoryId="1234" />);
    expect(wrapper).toMatchSnapshot();
  });
});
