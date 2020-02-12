import React from 'react';
import { mount } from 'enzyme';
import Widgets from './index';

jest.useFakeTimers();

jest.mock('react', () => ({
  ...require.requireActual('react'),
  Suspense: function Suspense({ children }) { return children; },
}));

/**
 * A mock Image component.
 * @returns {JSX}
 */
const Image = () => <img alt="" />;
/* eslint-disable react/prop-types */
/**
 * A mock WidgetGrid component.
 * @param {Array} children Array of children.
 * @returns {JSX}
 */
const WidgetGrid = ({ children }) => <div className="widget-grid">{children}</div>;
/* eslint-enable react/prop-types */

const components = {
  '@shopgate/commerce-widgets/image': Image,
  '@shopgate/commerce-widgets/widget-grid': WidgetGrid,
};

describe('<Widgets />', () => {
  it('should render a grid if height is defined', () => {
    const widgets = [{
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
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));

    expect(wrapper.find('WidgetGrid').exists()).toBe(true);
  });

  it('should not wrap a widget which is not a grid and has no height', () => {
    const widgets = [{
      col: 0,
      row: 0,
      width: 12,
      settings: {
        id: 83535,
        image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
      },
      type: '@shopgate/commerce-widgets/image',
    }];

    const wrapper = mount((
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WidgetGrid').exists()).toBe(false);
  });

  it('should render a grid if the widget is of type grid', () => {
    const widgets = [{
      type: '@shopgate/commerce-widgets/widget-grid',
      settings: {
        widgets: [
          {
            col: 0,
            row: 0,
            width: 12,
            height: 5,
            settings: {
              id: '84961',
              alt: '',
              image: 'https://data.shopgate.com/shop_widget_images/23836/aedc545959f55e3f73851eca0ed40a75.min.jpeg',
              link: '/category/',
            },
            type: '@shopgate/commerce-widgets/image',
          },
        ],
      },
    }];

    const wrapper = mount((
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WidgetGrid').exists()).toBe(true);
  });

  it('should render only one widget when the second one is not published and third one is invalid', () => {
    const widgets = [
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          id: 835351,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
        },
        type: '@shopgate/commerce-widgets/image',
      },
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          id: 835352,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
        },
        type: '@shopgate/commerce-widgets/imagefoo',
      },
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          published: false,
          id: 835353,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
        },
        type: '@shopgate/commerce-widgets/image',
      },
    ];

    const wrapper = mount((
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('img').length).toBe(1);
  });

  it('should schedule a re-render when widget is scheduled', () => {
    const minutesToNextFullHour = 60 - new Date().getMinutes();
    const msToNextFullHour = minutesToNextFullHour * 60000;
    const scheduledFromMs = (Date.now() + msToNextFullHour) - 1;
    const scheduledToMs = Date.now() + minutesToNextFullHour + 1000;
    /* eslint-disable camelcase */
    const widgets = [
      {
        col: 0,
        row: 0,
        width: 12,
        settings: {
          id: 835351,
          image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
          published: true,
          plan: true,
          planDate: {
            valid_from: new Date(scheduledFromMs).toISOString(),
            valid_to: new Date(scheduledToMs).toISOString(),
          },
        },
        type: '@shopgate/commerce-widgets/image',
      },
    ];
    /* eslint-enable camelcase */
    const wrapper = mount((
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));
    wrapper.instance().forceUpdate = jest.fn();
    expect(wrapper.find(Image).exists()).toBe(false);
    jest.advanceTimersByTime(msToNextFullHour);
    expect(wrapper.instance().forceUpdate).toHaveBeenCalledTimes(1);
    // In real life next timeout should be in 60 minutes.
    // This test has same Date and fake timers.
    jest.advanceTimersByTime(msToNextFullHour);
    expect(wrapper.instance().forceUpdate).toHaveBeenCalledTimes(2);
    wrapper.instance().componentWillUnmount();
    expect(clearTimeout).toHaveBeenCalled();
  });

  it('should render only wrapper when widgets array is empty', () => {
    const widgets = [];
    const wrapper = mount((
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));
    expect(wrapper.find('Image').exists()).toBe(false);
  });

  it('should render null when no widgets are passed', () => {
    const wrapper = mount((
      <Widgets
        components={components}
      />
    ));
    expect(wrapper.html()).toBe(null);
  });

  it('should check settings of child widgets inside widget-grid', () => {
    const widgets = [
      {
        height: 2,
        id: 'index-5-@shopgate/commerce-widgets/widget-grid',
        type: '@shopgate/commerce-widgets/widget-grid',
        settings: {
          widgets: [
            {
              col: 0,
              row: 0,
              height: 2,
              width: 2,
              settings: {
                id: 835351,
                image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
                published: true,
                plan: false,
              },
              type: '@shopgate/commerce-widgets/image',
            },
            {
              col: 2,
              row: 0,
              height: 2,
              width: 2,
              settings: {
                id: 835352,
                image: 'https://data.shopgate.com/shop_widget_images/23836/92204c0f264ac30d6836994c2fb64eb1.min.jpeg',
                published: false,
                plan: false,
              },
              type: '@shopgate/commerce-widgets/image',
            },
          ],
        },
      },
    ];
    const wrapper = mount((
      <Widgets
        components={components}
        widgets={widgets}
      />
    ));
    expect(wrapper.find('img').length).toBe(1);
  });
});
