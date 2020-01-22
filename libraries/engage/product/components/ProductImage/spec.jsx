import React from 'react';
import { shallow } from 'enzyme';
import Image from '@shopgate/pwa-common/components/Image';
import { mockThemeConfig } from '@shopgate/pwa-common/helpers/config/mock';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import styles from './style';
import ProductImage from './index';

jest.mock('../../../core/hocs/withWidgetSettings');

let mockHideProductImageShadow;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hideProductImageShadow() { return mockHideProductImageShadow; },
  themeConfig: {
    colors: {},
    shadows: mockThemeConfig.shadows,
  },
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

  it('should not apply an inner shadow to the placeholder if turned off via the app config', () => {
    mockHideProductImageShadow = true;
    const wrapper = shallow(<ProductImage />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(0);
  });

  it('should not apply an inner shadow to the image if turned off via the app config', () => {
    mockHideProductImageShadow = true;
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(0);
  });

  it('should not apply an inner shadow to the placeholder if turned off via the widget settings', () => {
    const wrapper = shallow(<ProductImage widgetSettings={{ showInnerShadow: false }} />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(0);
  });

  it('should not apply an inner shadow to the image if turned off via the widget settings', () => {
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" widgetSettings={{ showInnerShadow: false }} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(0);
  });

  it('should apply an inner shadow to the placeholder if turned off via the widget settings', () => {
    const wrapper = shallow(<ProductImage widgetSettings={{ showInnerShadow: true }} />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(1);
  });

  it('should apply an inner shadow to the image if turned off via the widget settings', () => {
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" widgetSettings={{ showInnerShadow: true }} />).dive();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(`.${styles.innerShadow}`).length).toBe(1);
  });
});
