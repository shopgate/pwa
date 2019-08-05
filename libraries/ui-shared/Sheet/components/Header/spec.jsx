import React from 'react';
import { shallow } from 'enzyme';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import Header from './index';

describe('<Header />', () => {
  it('should render with correct title', () => {
    const title = 'My Title';
    const wrapper = shallow(<Header title={title} />, mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('GridItem').first().props().children).toEqual(title);
  });
});
