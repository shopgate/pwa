import { type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductShareButton from './ProductShareButton';

const mockShare = jest.fn();
let mockCanShare = true;
let mockEnabled = true;

jest.mock('@shopgate/engage/product/hooks', () => ({
  useProductShare: () => ({
    enabled: mockEnabled,
    canShare: mockCanShare,
    share: mockShare,
  }),
}));
jest.mock('@shopgate/engage/components', () => ({ ShareIconIOS: () => null }));
jest.mock('@shopgate/engage/core/helpers', () => ({ i18n: { text: (key: string) => key } }));
jest.mock('@shopgate/engage/components/v2', () => ({
  IconButton: ({ children, onClick, 'aria-label': label }: {
    children: ReactNode;
    onClick: () => void;
    'aria-label': string;
  }) => <button type="button" aria-label={label} onClick={onClick}>{children}</button>,
}));

describe('<ProductShareButton />', () => {
  it('shares the product', () => {
    mockCanShare = true;
    render(<ProductShareButton productId="p1" />);

    fireEvent.click(screen.getByRole('button', { name: 'product.share' }));

    expect(mockShare).toHaveBeenCalled();
  });

  it('renders nothing when switched off', () => {
    mockEnabled = false;
    const { container } = render(<ProductShareButton productId="p1" />);

    expect(container).toBeEmptyDOMElement();
    mockEnabled = true;
  });

  it('renders nothing when the product cannot be shared', () => {
    mockCanShare = false;
    const { container } = render(<ProductShareButton productId="p1" />);

    expect(container).toBeEmptyDOMElement();
  });
});
