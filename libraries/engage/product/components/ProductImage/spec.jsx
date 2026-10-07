import { render } from '@testing-library/react';
import Image from '@shopgate/pwa-common/components/Image';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductImage from './index';
import { useProductImageShadow } from './hooks';

jest.unmock('@shopgate/pwa-core');
jest.mock('@shopgate/pwa-common/helpers/config');
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: () => null,
}));
jest.mock('@shopgate/pwa-common/components/Image', () => jest.fn(({ src, placeholder }) => (
  src ? <img src={src} alt="" /> : placeholder
)));
jest.mock('@shopgate/pwa-common/components/SurroundPortals', () => jest.fn(({ children }) => children));
jest.mock('./ProductImagePlaceholder', () => jest.fn(() => null));

// The mock returns what the resolver produces before the app settings are hydrated: the built-in
// resolutions, and no ratio, so the Image derives it from the largest resolution as before.
jest.mock('./hooks', () => ({
  useProductImageShadow: jest.fn(() => false),
}));

jest.mock('@shopgate/engage/settings/hooks', () => ({
  useProductImageSettings: () => ({
    pdp: {
      resolutions: [
        {
          width: 440,
          height: 440,
        },
        {
          width: 1024,
          height: 1024,
        },
      ],
      ratio: null,
    },
    gallery: {
      resolutions: [
        {
          width: 1024,
          height: 1024,
        },
        {
          width: 2048,
          height: 2048,
        },
      ],
      ratio: null,
    },
    list: {
      resolutions: [
        {
          width: 440,
          height: 440,
        },
      ],
      ratio: null,
    },
  }),
}));

const src = 'http://placehold.it/300x300';
const listResolutions = [{
  width: 440,
  height: 440,
}];

const expectImageProps = imageProps => expect(Image.mock.lastCall[0]).toMatchObject({
  resolutions: listResolutions,
  ratio: null,
  backgroundColor: 'var(--sg-palette-common-white)',
  'aria-hidden': true,
  ...imageProps,
});

const expectPortalProps = portalProps => expect(SurroundPortals.mock.lastCall[0]).toEqual(
  expect.objectContaining({
    portalName: 'component.product-image',
    portalProps,
  })
);

describe('<ProductImage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useProductImageShadow.mockReturnValue(false);
  });

  it('should render a placeholder if no src prop is provided', () => {
    const { container } = render(<ProductImage />);

    const root = container.querySelector('.engage__product__product-image');
    const placeholder = root.querySelector('[data-test-id="placeHolder"]');

    expect(root.className).toContain('rounded');
    expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    expect(placeholder.querySelectorAll('svg')).toHaveLength(1);
    expect(ProductImagePlaceholder).not.toHaveBeenCalled();
    expectImageProps({
      className: '',
      placeholderSrc: null,
    });
    expectPortalProps(undefined);
  });

  it('should render the image without a placeholder', () => {
    const { container } = render(<ProductImage src={src} />);

    const root = container.querySelector('.engage__product__product-image');

    expect(root.querySelectorAll('img')).toHaveLength(1);
    expect(root.querySelector('img')).toHaveAttribute('src', src);
    expect(root.querySelector('svg')).not.toBeInTheDocument();
    expectImageProps({
      className: '',
      placeholderSrc: null,
      src,
    });
    expectPortalProps({
      src,
      resolutions: listResolutions,
      ratio: null,
    });
  });

  // Most callers are untyped .jsx, and extensions are not type checked at all.
  it('should fall back to the default context for an unknown one', () => {
    render(<ProductImage src={src} context="somethingElse" />);

    expect(Image.mock.lastCall[0]).toMatchObject({ resolutions: listResolutions });
  });

  describe('inner shadow', () => {
    it('should not apply it to the placeholder when the hook says no', () => {
      render(<ProductImage placeholderSrc={src} />);

      expect(ProductImagePlaceholder.mock.lastCall[0]).toEqual({
        src,
        showInnerShadow: false,
        noBackground: false,
      });
      expectImageProps({
        className: '',
        placeholderSrc: src,
      });
      expectPortalProps(undefined);
    });

    it('should apply it to the placeholder when the hook says yes', () => {
      useProductImageShadow.mockReturnValue(true);
      render(<ProductImage placeholderSrc={src} />);

      expect(ProductImagePlaceholder.mock.lastCall[0]).toEqual({
        src,
        showInnerShadow: true,
        noBackground: false,
      });
      expectImageProps({
        className: expect.stringContaining('innerShadow'),
        placeholderSrc: src,
      });
    });

    it('should apply it to the image when the hook says yes', () => {
      useProductImageShadow.mockReturnValue(true);
      render(<ProductImage src={src} />);

      expectImageProps({
        className: expect.stringContaining('innerShadow'),
        src,
      });
      expectPortalProps({
        src,
        resolutions: listResolutions,
        ratio: null,
      });
    });
  });
});
