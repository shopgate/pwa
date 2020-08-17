import React from 'react';
import { mount } from 'enzyme';
import ProductsContent from './index';

jest.mock('@shopgate/engage/a11y', () => ({
  Section: ({ children }) => children,
}));
jest.mock('../Products', () => function Products() { return null; });

describe('<ProductsContent />', () => {
  it('should render with products', () => {
    const wrapper = mount(<ProductsContent hasProducts categoryId="1234" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without products', () => {
    const wrapper = mount(<ProductsContent categoryId="1234" />);
    expect(wrapper).toMatchSnapshot();
  });
});
