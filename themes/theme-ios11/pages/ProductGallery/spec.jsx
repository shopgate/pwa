import { render } from '@testing-library/react';
import ProductGalleryContent from './components/Content';
import ProductGalleryAppBar from './components/AppBar';
import ProductGallery from './index';

jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: ({ children }) => children({
      params: {
        productId: '53473130',
        slide: 2,
      },
    }),
  },
}));

jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }) => children,
}));
jest.mock('./components/Content', () => jest.fn(() => null));
jest.mock('./components/AppBar', () => jest.fn(() => null));

describe('<ProductGallery> page', () => {
  it('should render content and an appbar', () => {
    render(<ProductGallery />);

    expect(ProductGalleryAppBar).toHaveBeenCalled();
    expect(ProductGalleryContent.mock.lastCall[0]).toEqual({
      productId: 'SG10',
      initialSlide: 2,
    });
  });
});
