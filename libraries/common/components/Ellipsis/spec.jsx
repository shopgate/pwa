import React from 'react';
import { shallow } from 'enzyme';
import Ellipsis from './index';

const clamp = 3;
const text = 'Some very long text that should be cut off by this ellipsis component.';

describe('<Ellipsis />', () => {
  it('should render', () => {
    const wrapper = shallow(<Ellipsis rows={clamp}>{text}</Ellipsis>);

    expect(wrapper).toMatchSnapshot();
  });
});
