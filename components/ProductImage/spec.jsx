import React from 'react';
import { shallow } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import Placeholder from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import styles from './style';
import ProductImage from './index';

let mockHideProductImageShadow;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hideProductImageShadow() { return mockHideProductImageShadow; },
  themeConfig: {
    colors: {
      light: '#fff',
    },
  },
}));

describe('<ProductImage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHideProductImageShadow = false;
  });

  it('should render a placeholder if no src prop is provided', () => {
    const wrapper = shallow(<ProductImage />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(0);
    expect(wrapper.find(Placeholder).length).toBe(1);
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(1);
  });

  it('should render the image without a placeholder', () => {
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find(Placeholder).length).toBe(0);
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(2);
  });

  it('should not apply an inner shadow to the placeholder if turned off via the app config', () => {
    mockHideProductImageShadow = true;
    const wrapper = shallow(<ProductImage />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(0);
  });

  it('should not apply an inner shadow to the image if turned off via the app config', () => {
    mockHideProductImageShadow = true;
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(0);
  });
});
