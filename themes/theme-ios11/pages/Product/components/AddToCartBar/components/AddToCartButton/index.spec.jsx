import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToCartButton from './index';

jest.mock('@shopgate/engage/core/helpers', () => ({ i18n: { text: key => key } }));
jest.mock('@shopgate/engage/product/components/AddedTick', () => ({
  AddedTick: () => <span>tick</span>,
}));
jest.mock('@shopgate/engage/components/v2', () => ({
  CircularProgress: () => <span>spinner</span>,
  // eslint-disable-next-line react/prop-types
  Button: ({ children, testId, ...props }) => (
    <button type="button" data-test-id={testId} {...props}>{children}</button>
  ),
}));

describe('<AddToCartButton />', () => {
  it('shows the label while idle and handles clicks', () => {
    const onClick = jest.fn();
    render(<AddToCartButton disabled={false} state="idle" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByText('product.add_to_cart')).not.toHaveAttribute('data-hidden');
    expect(screen.queryByText('spinner')).not.toBeInTheDocument();
  });

  it('shows a spinner while the product is added', () => {
    render(<AddToCartButton disabled={false} state="pending" onClick={jest.fn()} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('spinner')).toBeInTheDocument();
    expect(screen.getByText('product.add_to_cart')).toHaveAttribute('data-hidden', 'true');
  });

  it('shows a tick after the product was added', () => {
    render(<AddToCartButton disabled={false} state="added" onClick={jest.fn()} />);

    expect(screen.getByText('tick')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'added');
  });
});
