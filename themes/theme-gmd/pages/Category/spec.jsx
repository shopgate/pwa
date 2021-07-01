import React from 'react';
import { shallow } from 'enzyme';
import Category from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/pwa-common/helpers/config');
jest.mock('./components/Content', () => 'CategoryContent');

describe('Pages: <Category />', () => {
  it('should render', () => {
    const wrapper = shallow(<Category />);
    expect(wrapper).toMatchSnapshot();
  });
});
