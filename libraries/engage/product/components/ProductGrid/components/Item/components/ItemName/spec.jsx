import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
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
    const wrapper = render(<ItemName {...props} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
