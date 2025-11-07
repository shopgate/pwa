import React from 'react';
import { shallow } from 'enzyme';
import ItemName from './index';

jest.mock('@shopgate/engage/product', () => ({
  ProductName: () => null,
}));

jest.mock('@shopgate/engage/components');

const props = {
  productId: '1234',
  name: 'Foo',
};

describe('<ItemName />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<ItemName {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
