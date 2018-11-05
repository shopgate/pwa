import React from 'react';
import { shallow } from 'enzyme';
import ProgressiveImage from '@shopgate/pwa-common/components/ProgressiveImage';
import Placeholder from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import ProductImage from './index';

describe('<ProductImage />', () => {
  it('should render a placeholder if no src prop is provided', () => {
    const wrapper = shallow(<ProductImage />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProgressiveImage).length).toBe(0);
    expect(wrapper.find(Placeholder).length).toBe(1);
  });

  it('should render the image without a placeholder', () => {
    const wrapper = shallow(<ProductImage srcset={['http://placehold.it/300x300']} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ProgressiveImage).length).toBe(1);
    expect(wrapper.find(Placeholder).length).toBe(0);
  });
});
