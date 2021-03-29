import React, { useContext } from 'react';
import { shallow } from 'enzyme';
import StoreListProduct from '../StoreListProduct';

const product = {
  featuredImageUrl: 'http://www.some.com&height=200',
  featuredImageBaseUrl: 'http://www.some.com',
  name: 'Test Product',
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));
jest.mock('@shopgate/engage/components');
jest.mock('../../../locations.context', () => 'FulfillmentContext');
jest.mock('../StoreListProductName', () => function StoreListProductName() { return null; });
jest.mock('../StoreListProductInfo', () => function StoreListProductInfo() { return null; });

describe('<StoreListProduct />', () => {
  it('should not render if not product is supplied', () => {
    useContext.mockReturnValueOnce({});
    const wrapper = shallow(<StoreListProduct />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render a product without selected variants.', () => {
    useContext.mockReturnValueOnce({ product });
    const wrapper = shallow(<StoreListProduct />);
    expect(wrapper).toMatchSnapshot();
  });
});
