/* eslint-disable react/prop-types */
import { render, screen, within } from '@testing-library/react';
import Cart from './index';

jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }) => <main>{children}</main>,
}));

jest.mock('./components/Content', () => function Content() { return <div>Cart content</div>; });

describe('<Cart> page', () => {
  it('should render the cart content inside of the view', () => {
    render(<Cart />);

    expect(within(screen.getByRole('main')).getByText('Cart content')).toBeInTheDocument();
  });
});
/* eslint-enable react/prop-types */
