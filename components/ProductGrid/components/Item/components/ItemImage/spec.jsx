import React from 'react';
import { shallow } from 'enzyme';
import ItemImage from './index';

describe('<ItemImage />', () => {
  it('should render', () => {
    const wrapper = shallow(<ItemImage productId="1234" imageUrl="http://www.google.com" name="FooBar" />);
    expect(wrapper).toMatchSnapshot();
  });
});
