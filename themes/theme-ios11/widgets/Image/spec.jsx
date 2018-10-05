import React from 'react';
import { shallow } from 'enzyme';
import ImageWidget from './index';

describe('<ImageWidget />', () => {
  it('should render the ImageWidget', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      link: '/category/3339',
    };

    const wrapper = shallow(<ImageWidget settings={settings} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the ImageWidget without link', () => {
    const settings = {
      id: '81452',
      alt: 'Alt text',
      image: 'https://data.shopgate.com/shop_widget_images/22874/1a2a3d3.min.jpeg',
      link: '',
    };

    const wrapper = shallow(<ImageWidget settings={settings} />);

    expect(wrapper.find('Link').exists()).toBe(false);
    expect(wrapper).toMatchSnapshot();
  });
});
