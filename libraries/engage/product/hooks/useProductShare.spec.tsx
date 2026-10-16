import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { shareItem } from '@shopgate/engage/core/commands';
import { hasSGJavaScriptBridge, hasWebBridgeCore } from '@shopgate/engage/core/helpers';
import useProductShare, { getShareImageUrl } from './useProductShare';

let mockProduct: unknown = null;

jest.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({}),
}));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getProduct: () => mockProduct,
}));
jest.mock('@shopgate/engage/core/commands', () => ({ shareItem: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getProductActionButtons: () => ({ showShareButton: true }),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  hasSGJavaScriptBridge: jest.fn(() => true),
  hasWebBridgeCore: jest.fn(() => false),
}));

/**
 * Renders a share trigger for the hook.
 * @returns The trigger.
 */
const Share = () => {
  const { canShare, share } = useProductShare('p1');
  return canShare ? <button type="button" onClick={share}>share</button> : <span>none</span>;
};

describe('useProductShare()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hasSGJavaScriptBridge as jest.Mock).mockReturnValue(true);
    (hasWebBridgeCore as jest.Mock).mockReturnValue(false);
  });

  it('cannot share products without url', () => {
    mockProduct = { name: 'Jacket' };
    render(<Share />);

    expect(screen.getByText('none')).toBeInTheDocument();
  });

  it('shares name, image and url with the app', () => {
    mockProduct = {
      name: 'Jacket',
      productUrl: 'https://shop.example/jacket',
      featuredImageUrl: 'https://img-cdn.shopgate.com/1/abc',
    };
    render(<Share />);

    fireEvent.click(screen.getByRole('button', { name: 'share' }));

    expect(shareItem).toHaveBeenCalledWith({
      title: 'Jacket',
      imageURL: 'https://img-cdn.shopgate.com/1/abc?w=880&h=880',
      deepLink: 'https://shop.example/jacket',
    });
  });

  it('uses the share sheet of the browser outside of the app', () => {
    const share = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
    });
    (hasSGJavaScriptBridge as jest.Mock).mockReturnValue(false);
    mockProduct = {
      name: 'Jacket',
      productUrl: 'https://shop.example/jacket',
    };
    render(<Share />);

    fireEvent.click(screen.getByRole('button', { name: 'share' }));

    expect(share).toHaveBeenCalledWith({
      title: 'Jacket',
      url: 'https://shop.example/jacket',
    });
    expect(shareItem).not.toHaveBeenCalled();
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });
  });
});

describe('getShareImageUrl()', () => {
  it('keeps urls of the current image service', () => {
    expect(getShareImageUrl('https://images.example/a.jpg')).toBe('https://images.example/a.jpg');
    expect(getShareImageUrl(undefined)).toBe('');
  });
});
