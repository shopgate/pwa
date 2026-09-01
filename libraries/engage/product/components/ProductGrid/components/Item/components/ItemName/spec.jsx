import React from 'react';
import { render } from '@testing-library/react';
import { ProductName } from '@shopgate/engage/product';
import ItemName from './index';

// Resolve selectors against an empty state so they fall back to the built-in appSettings defaults.
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: selector => selector(undefined),
}));

jest.mock('@shopgate/engage/product', () => ({
  ProductName: jest.fn(() => null),
  ProductRatingStars: () => null,
}));

jest.mock('@shopgate/engage/components');

const props = {
  productId: '1234',
  name: 'Foo',
};

describe('<ItemName />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with minimal props', () => {
    const wrapper = render(<ItemName {...props} />);
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it('should clamp the name to the configured tile line count', () => {
    render(<ItemName {...props} />);

    // The tile name line count comes from the appSettings channel; 3 is the built-in default.
    expect(ProductName.mock.calls[0][0].rows).toBe(3);
  });
});
