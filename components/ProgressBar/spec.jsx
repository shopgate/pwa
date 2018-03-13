import React from 'react';
import { shallow } from 'enzyme';
import Transition from 'react-transition-group/Transition';
import ProgressBar from './index';

describe('<ProgressBar />', () => {
  it('renders an indeterminate progress bar.', () => {
    const wrapper = shallow(<ProgressBar isVisible />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Transition).length).toBe(1);
  });
});
