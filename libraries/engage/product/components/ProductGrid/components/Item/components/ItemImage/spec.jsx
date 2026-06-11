import React from 'react';
import { render } from '@testing-library/react';
import ItemImage from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/product');

describe('<ItemImage />', () => {
  it('should render', () => {
    const wrapper = render(<ItemImage productId="1234" imageUrl="http://www.google.com" name="FooBar" />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
