import React, { useContext } from 'react';
import { shallow } from 'enzyme';
import Product from '../Product';

const product = {
  featuredImageUrl: 'http://www.some.com',
  name: 'Test Product',
};

const selectedVariants = [
  {
    label: 'test',
    value: 'test',
  },
];

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('<Product />', () => {
  it('should not render if not product is supplied', () => {
    useContext.mockReturnValueOnce({});
    const wrapper = shallow(<Product />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render a product without selected variants.', () => {
    useContext.mockReturnValueOnce({ product });
    const wrapper = shallow(<Product />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Ellipsis').getElements().length).toEqual(1);
    expect(wrapper.find('[data-test-id="selected-variants"]').getElements().length).toEqual(0);
  });

  it('should render a product with selected variants', () => {
    useContext.mockReturnValueOnce({
      product,
      selectedVariants,
    });
    const wrapper = shallow(<Product />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Ellipsis').getElements().length).toEqual(1);
    expect(wrapper.find('[data-test-id="selected-variants"]').getElements().length).toEqual(1);
  });
});
