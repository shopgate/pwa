import React from 'react';
import { mount } from 'enzyme';
import WidgetGrid from './index';

jest.mock('react', () => ({
  ...require.requireActual('react'),
  Suspense: function Suspense({ children }) { return children; },
}));

/**
 * A mock Image component.
 * @returns {JSX}
 */
const Image = () => <div />;

const components = {
  '@shopgate/commerce-widgets/image': Image,
};

describe('<WidgetGrid />', () => {
  it('should render with a config', () => {
    const config = [{
      col: 0,
      row: 0,
      width: 12,
      height: 3,
      settings: {
        id: 83535,
        image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
      },
      type: '@shopgate/commerce-widgets/image',
    }];

    const wrapper = mount((
      <WidgetGrid config={config} components={components} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toEqual(1);
  });

  it('should not render without a `config` prop', () => {
    const wrapper = mount((
      <WidgetGrid components={components} />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toEqual(0);
  });
});
