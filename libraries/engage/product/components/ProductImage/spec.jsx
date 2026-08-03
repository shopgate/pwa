import React from 'react';
import { shallow } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import ProductImagePlaceholder from './ProductImagePlaceholder';
import ProductImage from './index';
import { useProductImageShadow } from './hooks';

jest.unmock('@shopgate/pwa-core');
jest.mock('../../../core/hocs/withWidgetSettings');
jest.mock('@shopgate/pwa-common/helpers/config');
// Shallow renders have no store; the component only reads the shop wide placeholder from it.
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: () => null,
}));
jest.mock('@shopgate/engage/components', () => ({
  Image: () => null,
}));

// These are shallow renders, so there is no Provider for the hook to read the store from. The
// mock returns what the resolver produces before the app settings are hydrated: the built-in
// resolutions, and no ratio, so the Image derives it from the largest resolution as before.
jest.mock('./hooks', () => ({
  useProductImageShadow: jest.fn(() => false),
}));

jest.mock('@shopgate/engage/settings/hooks', () => ({
  useProductImageSettings: () => ({
    pdp: {
      resolutions: [{ width: 440, height: 440 }, { width: 1024, height: 1024 }],
      ratio: null,
    },
    gallery: {
      resolutions: [{ width: 1024, height: 1024 }, { width: 2048, height: 2048 }],
      ratio: null,
    },
    list: {
      resolutions: [{ width: 440, height: 440 }],
      ratio: null,
    },
  }),
  // Mocking the barrel replaces every export, and the Image component pulls this one from it.
  useImageServiceSettings: () => ({
    quality: 75,
    fillColor: 'FFFFFF',
    fillTransparent: true,
  }),
}));

/**
 * Reads the placeholder element the component hands to the Image. Image decides when to render it,
 * so the placeholder is a prop here rather than part of this component's tree.
 * @param {Object} wrapper The rendered ProductImage.
 * @returns {JSX.Element} The placeholder element.
 */
const getPlaceholder = wrapper => wrapper.find(Image).prop('placeholder');

/**
 * Renders down to the component's own output, past the wrapper that supplies the shop wide
 * placeholder and past the portals.
 * @param {JSX.Element} element The element to render.
 * @returns {Object} The rendered component.
 */
const renderProductImage = element => shallow(element).dive().dive();

describe('<ProductImage />', () => {
  it('should render a placeholder if no src prop is provided', () => {
    const wrapper = renderProductImage(<ProductImage />);

    expect(wrapper).toMatchSnapshot();
    expect(shallow(getPlaceholder(wrapper)).find(PlaceholderIcon).length).toBe(1);
  });

  it('should render the image without a placeholder', () => {
    const wrapper = renderProductImage(<ProductImage src="http://placehold.it/300x300" />);

    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find(PlaceholderIcon).length).toBe(0);
    expect(wrapper).toMatchSnapshot();
  });

  // Most callers are untyped .jsx, and extensions are not type checked at all.
  it('should fall back to the default context for an unknown one', () => {
    const wrapper = renderProductImage(
      <ProductImage src="http://placehold.it/300x300" context="somethingElse" />
    );

    expect(wrapper.find(Image).prop('resolutions')).toEqual([{
      width: 440,
      height: 440,
    }]);
  });

  describe('inner shadow', () => {
    it('should not apply it to the placeholder when the hook says no', () => {
      useProductImageShadow.mockReturnValue(false);
      const wrapper = renderProductImage(<ProductImage placeholderSrc="http://placehold.it/300x300" />);

      expect(getPlaceholder(wrapper).type).toBe(ProductImagePlaceholder);
      expect(getPlaceholder(wrapper).props.showInnerShadow).toBe(false);
      expect(wrapper).toMatchSnapshot();
    });

    it('should not apply it to the image when the hook says no', () => {
      useProductImageShadow.mockReturnValue(false);
      const wrapper = renderProductImage(<ProductImage src="http://placehold.it/300x300" />);

      expect(wrapper.find(Image).prop('className')).not.toContain('innerShadow');
      expect(wrapper).toMatchSnapshot();
    });

    it('should apply it to the placeholder when the hook says yes', () => {
      useProductImageShadow.mockReturnValue(true);
      const wrapper = renderProductImage(<ProductImage placeholderSrc="http://placehold.it/300x300" />);

      expect(getPlaceholder(wrapper).type).toBe(ProductImagePlaceholder);
      expect(getPlaceholder(wrapper).props.showInnerShadow).toBe(true);
      expect(wrapper).toMatchSnapshot();
    });

    it('should apply it to the image when the hook says yes', () => {
      useProductImageShadow.mockReturnValue(true);
      const wrapper = renderProductImage(<ProductImage src="http://placehold.it/300x300" />);

      expect(wrapper.find(Image).prop('className')).toContain('innerShadow');
      expect(wrapper).toMatchSnapshot();
    });
  });
});
