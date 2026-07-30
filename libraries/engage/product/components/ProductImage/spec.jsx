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
jest.mock('./connector', () => Component => Component);
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

describe('<ProductImage />', () => {
  it('should render a placeholder if no src prop is provided', () => {
    const wrapper = shallow(<ProductImage />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(0);
    expect(wrapper.find(PlaceholderIcon).length).toBe(1);
  });

  it('should render the image without a placeholder', () => {
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find(PlaceholderIcon).length).toBe(0);
  });

  describe('inner shadow', () => {
    it('should not apply it to the placeholder when the hook says no', () => {
      useProductImageShadow.mockReturnValue(false);
      const wrapper = shallow(<ProductImage placeholderSrc="http://placehold.it/300x300" />).dive();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(ProductImagePlaceholder).prop('showInnerShadow')).toBe(false);
    });

    it('should not apply it to the image when the hook says no', () => {
      useProductImageShadow.mockReturnValue(false);
      const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />).dive();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Image).prop('className')).toBe('');
    });

    it('should apply it to the placeholder when the hook says yes', () => {
      useProductImageShadow.mockReturnValue(true);
      const wrapper = shallow(<ProductImage placeholderSrc="http://placehold.it/300x300" />).dive();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(ProductImagePlaceholder).prop('showInnerShadow')).toBe(true);
    });

    it('should apply it to the image when the hook says yes', () => {
      useProductImageShadow.mockReturnValue(true);
      const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />).dive();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Image).prop('className')).toBeTruthy();
    });
  });
});
