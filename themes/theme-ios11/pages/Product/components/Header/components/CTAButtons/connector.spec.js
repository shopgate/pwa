import { getProductImages } from '@shopgate/engage/product';
import connect from './connector';

jest.mock('react-redux', () => ({
  connect: makeMapStateToProps => makeMapStateToProps,
}));
jest.mock('@shopgate/engage/favorites', () => ({
  isCurrentProductOnFavoriteList: () => false,
}));
jest.mock('@shopgate/engage/product', () => ({
  makeIsProductActive: () => () => true,
  getProductImages: jest.fn(),
}));
jest.mock('@shopgate/engage/settings/selectors/shopSettings', () => ({
  getLoadWishlistOnAppStartEnabled: () => true,
}));

describe('CTAButtons connector', () => {
  const mapStateToProps = connect();

  it('reads the gallery from the displayed product', () => {
    getProductImages.mockReturnValue(['a.jpg', 'b.jpg']);

    const props = mapStateToProps({}, {
      productId: 'selected',
      displayedProductId: 'displayed',
    });

    expect(getProductImages).toHaveBeenCalledWith({}, { productId: 'displayed' });
    expect(props.hasImageGallery).toBe(true);
  });

  it('reports a single image as no gallery', () => {
    getProductImages.mockReturnValue(['a.jpg']);

    expect(mapStateToProps({}, { productId: 'p1' }).hasImageGallery).toBe(false);
  });

  it('reports nothing while the images are loading', () => {
    getProductImages.mockReturnValue(null);

    expect(mapStateToProps({}, { productId: 'p1' }).hasImageGallery).toBeNull();
  });
});
