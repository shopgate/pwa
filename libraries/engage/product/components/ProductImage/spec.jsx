import React from 'react';
import { shallow } from 'enzyme';
import { Image, PlaceholderIcon } from '../../../components';
import ProductImage from './index';

describe('<ProductImage />', () => {
  it('should render a placeholder if no src prop is provided', () => {
    const wrapper = shallow(<ProductImage />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(0);
    expect(wrapper.find(PlaceholderIcon).length).toBe(1);
  });

  it('should render the image without a placeholder', () => {
    const wrapper = shallow(<ProductImage src="http://placehold.it/300x300" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Image).length).toBe(1);
    expect(wrapper.find(PlaceholderIcon).length).toBe(0);
  });
});
