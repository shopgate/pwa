import React from 'react';
import { mount } from 'enzyme';
import ImageWidget from './index';

jest.mock('@shopgate/pwa-common/components/Link', () => {
  /**
   * Mocked LinkComponent
   * @return {JSX}
   */
  const Link = () => <div />;
  return Link;
});

describe('<ImageWidget />', () => {
  it('should render the ImageWidget', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      link: '/category/3339',
    };

    const wrapper = mount(<ImageWidget settings={settings} />);

    expect(wrapper.find('Link').exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the ImageWidget without link', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      link: '',
    };

    const wrapper = mount(<ImageWidget settings={settings} />);

    expect(wrapper.find('Link').exists()).toBe(false);
    expect(wrapper).toMatchSnapshot();
  });
});
